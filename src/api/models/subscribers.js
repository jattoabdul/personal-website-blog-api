
import dotenv from 'dotenv';
// import {
//   sendMessage,
//   emailTemplate
// } from '../utils';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Subscribers = sequelize.define('Subscribers', {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    subscribedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  });

  Subscribers.associate = (models) => {
    // Subscribers.hasMany(models.Posts, {
    //   foreignKey: 'authorId'
    // });
  };

  // Instance methods
  // Subscribers.prototype.sendPostAsMail = function sendPostAsMail() {
  //   const user = this;
  //   return user;
  // };


  // Hooks
  // Subscribers.afterCreate(async (subscriber) => {
  //   // const userProfile = await sequelize.models.Profiles.create({
  //   //   userId: user.id
  //   // });

  //   if (!subscriber) {
  //     return sequelize.Promise
  //       .reject(new Error('Error occured while creating user profile'));
  //   }
  // });

  return Subscribers;
};
