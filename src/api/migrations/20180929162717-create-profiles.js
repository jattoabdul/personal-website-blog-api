module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      phoneNumber: {
        allowNull: true,
        type: Sequelize.STRING,
        validate: {
          not: ['[a-z]', 'i']
        }
      },
      dob: {
        allowNull: true,
        type: Sequelize.DATE
      },
      gender: {
        allowNull: true,
        type: Sequelize.STRING
      },
      initials: {
        allowNull: true,
        type: Sequelize.STRING
      },
      profilePic: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Profiles');
  }
};
