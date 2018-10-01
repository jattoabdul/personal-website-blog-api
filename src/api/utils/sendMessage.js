import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
// import Jusibe from 'jusibe';

dotenv.config();

export const sendMessage = {

/**
 * Send Email Function
 *
 * @param {string} email
 *
 * @param {string} subject
 *
 * @param {string} message (html)
 *
 * @return {string} error || info
 */
  email(email, subject, message) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_KEY
      }
    });

    const mailOptions = {
      // from: 'no-reply <jattoade@gmail.com>',
      from: 'no-reply <jannahfir@gmail.com>',
      to: email,
      subject,
      html: message
    };

    transporter.sendMail(mailOptions, (errors, info) => {
      if (errors) {
        return Promise.resolve(errors);
      }
      return Promise.resolve(info);
    });
  },

  /**
   * Send Email To Me Function
   *
   * @param {string} subject
   *
   * @param {string} message (html)
   *
   * @return {string} error || info
   */
  emailToMe(subject, message) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_KEY
      }
    });

    const mailOptions = {
      // from: 'no-reply <jattoade@gmail.com>',
      from: 'no-reply <jannahfir@gmail.com>',
      to: process.env.CONTACT_EMAIL,
      subject,
      html: message
    };

    transporter.sendMail(mailOptions, (errors, info) => {
      if (errors) {
        return Promise.resolve(errors);
      }
      return Promise.resolve(info);
    });
  }
};
