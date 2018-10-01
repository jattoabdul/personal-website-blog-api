import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

dotenv.config();

export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    lastLogin: {
      allowNull: true,
      type: DataTypes.DATE
    }
  });

  /* eslint-disable */
  Users.associate = (models) => {
    Users.belongsTo(models.Roles, {
      foreignKey: 'roleId',
      hooks: true
    });

    Users.hasMany(models.Posts, {
      foreignKey: 'authorId'
    });

    Users.hasOne(models.Profiles, {
      foreignKey: 'userId',
      hooks: true
    });
  };

  // Instance methods
  Users.prototype.generateAuthToken = function generateAuthToken() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.Role.name,
        access
      },
      process.env.SECRET_KEY,
      // secret key to expire in three days
      { expiresIn: 259200 }
    ).toString();
    return token;
  };

  Users.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  Users.prototype.toJSON = function toJSON() {
    const values = Object.assign({}, this.get());

    delete values.password;
    delete values.roleId;
    return values;
  };

  // Hooks
  Users.beforeCreate(async (user) => {
    user.roleId = 1;

    if (!user) {
      return sequelize.Promise
        .reject(new Error('Error occured while creating user'));
    }
  });

  Users.afterCreate(async (user) => {
    const userProfile = await sequelize.models.Profiles.create({
      userId: user.id
    });

    if (!userProfile) {
      return sequelize.Promise
        .reject(new Error('Error occured while creating user profile'));
    }
  });

  // Users.afterBulkCreate = (users) => {
  //   users.map(async (user) => {
  //     const userRole = await sequelize.models.UserRoles.create({
  //       userId: user.id,
  //       roleId: 1
  //     });

  //     if (!userRole) {
  //       return sequelize.Promise
  //         .reject(new Error('Error occured while creating user'));
  //     }
  //   });
  // };

  return Users;
};
