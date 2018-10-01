// import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import models from '../models';

// dotenv.config();

export const authenticate = {

  /**
   * authenticate user Function
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  user(req, res, next) {
    const token = req.body.token || req.query.token ||
      req.headers['x-access-token'];
    jwt.verify(token, process.env.SECRET_KEY, (err, authToken) => {
      if (err) {
        res.status(401)
          .json({
            message: 'sorry, user not authenticated, invalid access token'
          });
        return;
      }
      // if authenticated with auth token,
      // save auth token and to request for use in other routes
      req.authToken = authToken;
      authToken = JSON.stringify(authToken);
      res.append('user', authToken);
      next();
    });
  },

  // permit action
  permit(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;

    // return a middleware
    return (req, res, next) => {
      const user = req.authToken;
      if (user && isAllowed(user.role)) {
        // role is allowed, so continue on the next middleware
        next();
      } else {
        res.status(403).json({
          message: 'Forbidden'
        }); // user is forbidden
      }
    };
  }
};
