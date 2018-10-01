/**
 * User Controller
 * handles every user related task and authentication
 */

// importing services
import dotenv from 'dotenv';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import models from '../models';
import {
  sendMessage,
  emailTemplate
} from '../utils';
import paginate from '../utils/paginate';

dotenv.config();

const salt = bcrypt.genSaltSync(5);
const error = {};
export const users = {
  /**
   * passwordReset - request & send password change/update link to user's email
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} info
   */
  passwordReset(req, res) {
    const email = req.body.email;
    const secret = req.body.email;
    const hash = crypto
      .createHash('sha256', secret)
      .update(Date.now().toString())
      .digest('hex');
    const date = new Date();
    date.setHours(date.getHours() + 1);
    const expiresIn = `${date.toString().split(' ')[2]}
      :${date.toString().split(' ')[4]}`;
    if (email === undefined || email.trim() === '') {
      res.status(400).send({
        error: {
          message: 'email is not valid'
        }
      });
      return;
    }

    const subject = 'Reset Password Link',
      messaged = emailTemplate.resetPassword(email, hash);
    const message = process.env.NODE_ENV === 'production' ? messaged :
      messaged;

    models.PasswordReset
      .findOne({
        where: {
          email
        }
      }).then((response) => {
        if (response === null) {
          models.PasswordReset
            .create({
              email,
              expiresIn,
              hash
            }).then(() => {
              sendMessage.email(email, subject, message);
            });
        } else {
          response
            .update({
              hash,
              expiresIn
            }).then(() => {
              sendMessage.email(email, subject, message);
            });
        }
        if (process.env.NODE_ENV === ('development' || 'test')) {
          return res.status(200)
            .json({
              data: {
                message: 'Password Request Successful',
                hash
              }
            });
        }
        return res.status(200)
          .json({
            data: {
              message: 'Password Request Successful'
            }
          });
      });
  },

  /**
   * updatePassword - update the user's password in the database
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} data (message)
   */
  updatePassword(req, res) {
    const password = req.body.password;
    if (password === undefined || password.trim() === '') {
      res.status(400).send({
        error: {
          message: 'password is not defined or invalid'
        }
      });
      return;
    }

    const newPass = bcrypt
      .hashSync(req.body.password, salt, null);
    models.PasswordReset
      .findOne({
        where: {
          hash: req.params.hash
        }
      }).then((result) => {
        if (result) {
          const email = result.dataValues.email;
          const date = new Date();
          const now = `${date.toString().split(' ')[2]}
          :${date.toString().split(' ')[4]}`;
          if (now > result.dataValues.expiresIn) {
            res.status(400).send({
              error: {
                message: 'Expired or Invalid link'
              }
            });
            return;
          }
          return models.Users
            .update({
              password: newPass
            }, {
              where: {
                email
              }
            }).then(() =>
              res.status(200).send({
                data: {
                  message: 'Password Reset Successful'
                }
              })
            );
        }
        return res.status(400).send({
          error: {
            message: 'Hash is invalid'
          }
        });
      });
  },

  /**
   * signUp - create a user in the app
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} data (user)
   */
  signUp(req, res) {
    const hashedPassword = bcrypt
      .hashSync(req.body.password, salt, null);
    return models.Users
      .create({
        username: req.body.username.trim().toLowerCase(),
        email: req.body.email.trim().toLowerCase(),
        password: hashedPassword
      })
      .then((newUser) => {
        res.status(201).json({
          newUser
        });
      })
      .catch((err) => {
        if (err.errors[0].message === 'username must be unique') {
          err = {
            error: {
              message: 'username already exists'
            }
          };
          return res.status(409).send(err);
        }
        if (err.errors[0].message === 'email must be unique') {
          err = {
            error: {
              message: 'email already exists'
            }
          };
          return res.status(409).send(err);
        }
        if (err.errors[0].message === 'Validation isEmail on email failed') {
          err = {
            error: {
              message: 'not an email'
            }
          };
          return res.status(400).send(err);
        }
        if (!err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).send(err);
        }
      });
  },

  /**
   * authenticate - authenticate and signin a user
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} auth (token, message)
   */
  authenticate(req, res) {
    const {
      identifier
    } = req.body;
    models.Users
      .find({
        include: [{
          model: models.Roles,
          required: false,
          attributes: ['id', 'name']
        }],
        where: {
          $or: [{
            username: {
              $iLike: identifier.toLowerCase(),
            },
          },
          {
            email: {
              $iLike: identifier.toLowerCase(),
            },
          },
          ],
        }
      })
      .then(async (currentUser) => {
        const password = req.body.password;
        if (currentUser) {
          if (currentUser.validPassword(password)) {
            const loggedInUser = await currentUser.update({
              lastLogin: new Date()
            });

            if (loggedInUser) {
              const token = loggedInUser.generateAuthToken();
              return res
                .status(200)
                .json({
                  token,
                  message: `${loggedInUser.username} has successfully logged in`
                });
            }
            return res.status(400)
              .json({
                error: {
                  message: 'Error signing in'
                }
              });
          }
          return res.status(401)
            .json({
              error: {
                message: 'Invalid credentials'
              }
            });
        }
        return res.status(404)
          .json({
            error: {
              message: 'Invalid credentials'
            }
          });
      })
      .catch(() => res.status(500).json({
        error: {
          message: 'Error signing in'
        }
      }));
  },

  /**
   * getAllUsers - get all registered users
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user
   */
  getAllUsers(req, res) {
    const limitValue = req.query.limit || 2;
    const pageValue = (req.query.page - 1) || 0;
    return models.Users
      .findAndCountAll({
        limit: limitValue,
        offset: pageValue * limitValue
      })
      .then((foundUsers) => {
        const size = foundUsers.rows.length;
        return res.status(200).json({
          pagination: paginate(foundUsers.count, limitValue, pageValue, size),
          users: foundUsers.rows
        });
      })
      .catch(err => res.status(400).json({
        err
      }));
  },

  /**
   * getCurrentUser - get current authenticated user
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  getCurrentUser(req, res) {
    const username = req.authToken.username;
    return models.Users
      .find({
        include: [{
          model: models.Roles,
          required: false,
          attributes: ['id', 'name']
        },
        {
          model: models.Profiles,
          where: {
            userId: req.authToken.id
          }
        }
        ],
        where: {
          username
        },
        attributes: [
          'id',
          'email',
          'username',
          'lastLogin',
          'createdAt'
        ]
      })
      .then((currentUser) => {
        res.status(200).json({
          data: currentUser
        });
      })
      .catch((err) => {
        error.message = err.message;
        error.success = false;
        res.status(404).json(error);
      });
  },

  /**
   * viewUserDetail - get user details by id
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  viewUserDetail(req, res) {
    const userId = req.params.id || req.authToken.id;
    return models.Users
      .find({
        include: [{
          model: models.Roles,
          required: false,
          attributes: ['id', 'name']
        },
        {
          model: models.Profiles,
          where: {
            userId
          }
        }
        ],
        where: {
          id: userId
        },
        attributes: [
          'id',
          'email',
          'username',
          'lastLogin',
          'createdAt'
        ]
      })
      .then((currentUser) => {
        res.status(200).json({
          data: currentUser
        });
      })
      .catch((err) => {
        error.message = err.message;
        error.success = false;
        res.status(404).json(error);
      });
  },

  /**
   * edit - edit user Profile
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  editProfile(req, res) {
    let userId = req.authToken.id;

    if (req.query.userId) {
      if (req.authToken.role === 'admin') {
        userId = req.query.userId;
      } else {
        return res.status(400)
          .json({
            error: { message: 'user unauthorized to perform this action' }
          });
      }
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      dob,
      gender,
      initials,
      profilePic,
      roleId
    } = req.body;

    models.Profiles
      .findOne({
        where: { userId }
      })
      .then((foundUserProfile) => {
        if (foundUserProfile) {
          foundUserProfile.update({
            firstName: firstName || foundUserProfile.firstName,
            lastName: lastName || foundUserProfile.lastName,
            phoneNumber: phoneNumber || foundUserProfile.phoneNumber,
            dob: dob || foundUserProfile.dob,
            gender: gender || foundUserProfile.gender,
            initials: initials || foundUserProfile.initials,
            profilePic: profilePic || foundUserProfile.profilePic,
          })
            .then(async () => {
              if (roleId && req.authToken.role === 'admin') {
                const profileUser = await foundUserProfile.getUser();
                profileUser.update({
                  roleId
                })
                  .then(() => {
                    foundUserProfile.dataValues.roleId = profileUser.dataValues.roleId;
                    return res.status(201).json({
                      foundUserProfile: foundUserProfile.dataValues
                    });
                  })
                  .catch((err) => {
                    if (err) {
                      err = {
                        error: {
                          message: 'Server Error'
                        }
                      };
                      return res.status(500).json(err);
                    }
                  });
              } else {
                return res.status(201).json({
                  foundUserProfile
                });
              }
            })
            .catch((err) => {
              if (err) {
                err = {
                  error: {
                    message: 'Server Error'
                  }
                };
                return res.status(500).json(err);
              }
            });
        }
      })
      .catch((err) => {
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  }
};
