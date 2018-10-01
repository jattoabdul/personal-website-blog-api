module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [
      {
        name: 'General',
        desc: 'Default General Posts',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
