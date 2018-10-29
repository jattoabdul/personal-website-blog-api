const bcrypt = require('bcrypt-nodejs');

const salt = bcrypt.genSaltSync(5);
const hashedAdminPassword = bcrypt
  .hashSync(process.env.ADMIN_SEED_PASSWORD, salt, null);

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'jattoade',
        password: hashedAdminPassword,
        email: 'jattoade@gmail.com',
        roleId: 3,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'admin',
        password: hashedAdminPassword,
        email: 'admin@firdausamasa.com',
        roleId: 3,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'superadmin',
        password: hashedAdminPassword,
        email: 'amasafirdausa@gmail.com',
        roleId: 3,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
