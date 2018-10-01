module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        name: 'reader',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'editor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
