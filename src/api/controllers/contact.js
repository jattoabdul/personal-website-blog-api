/**
 * Contact Controller
 * handles every contact related task
 */

// importing services
import dotenv from 'dotenv';
import models from '../models';
import {
  sendMessage,
  emailTemplate
} from '../utils';


dotenv.config();

export const contact = {
  /**
   * sendMessage - send messages from contact to me
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  sendMessage(req, res) {
    const { email, fullName, clientSubject, phoneNumber, company, message } = req.body;

    const subject = `From my Blog by ${fullName}-${company || 'self'}`,
      messaged = emailTemplate.contactMe(fullName, email, phoneNumber, clientSubject, company, message);

    sendMessage.emailToMe(subject, messaged);

    return res.status(200)
      .json({
        data: {
          message: 'Message Sent Successfully'
        }
      });
  },

  /**
   * TODO: Create method and integrate workers
   * sendMonthlyNewsLetter - send monthly newsletter to subscribers
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  sendMonthlyNewsLetter(req, res) {
    // const { email, messages} = req.body;

    // const subject = `From my Blog by ${fullName}-${company || 'self'}`,
    //   messaged = emailTemplate.contactMe(fullName, email, phoneNumber, clientSubject, company, message);

    // sendMessage.emailToMe(subject, messaged);

    return res.status(200)
      .json({
        data: {
          message: 'Newsletters Sent Successfully'
        }
      });
  },

  /**
   * subscribeToPosts - subscribe to posts from our site
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  subscribeToPosts(req, res) {
    const { email } = req.body;
    return models.Subscribers
      .create({
        email,
        subscribedAt: new Date()
      })
      .then((subscriber) => {
        if (subscriber) {
          const subject = 'Subscription Success',
            messaged = emailTemplate.subscriptionSuccess(email);

          sendMessage.email(email, subject, messaged);
          res.status(200)
            .json({
              data: {
                message: 'You have successfully subscribed to our blogposts'
              }
            });
        }
      })
      .catch((err) => {
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
              message: 'internal server error occured'
            }
          };
          return res.status(500).send(err);
        }
      });
  }
};
