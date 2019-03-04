module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Profiles', [
      {
        userId: 1,
        firstName: 'Abdulqahhar',
        lastName: 'Aminu Jatto',
        phoneNumber: null,
        dob: null,
        gender: 'male',
        initials: null,
        profilePic: 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        firstName: 'Admin',
        lastName: 'Super',
        phoneNumber: null,
        dob: null,
        gender: 'male',
        initials: 'AS',
        profilePic: 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        firstName: 'Firdaus',
        lastName: 'Amasa',
        phoneNumber: null,
        dob: null,
        gender: 'female',
        initials: 'AS',
        profilePic: 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
