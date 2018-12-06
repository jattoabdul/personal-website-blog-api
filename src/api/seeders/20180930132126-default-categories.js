module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [
      {
        name: 'General',
        desc: 'General Articles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Law',
        desc: 'Law Related Articles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Islamic',
        desc: 'Islamic Articles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Motivational',
        desc: 'Motivational Articles',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
