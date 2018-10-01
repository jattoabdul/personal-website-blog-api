module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      desc: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      authorId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      publishedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      thumbnailUrl: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png'
      },
      viewCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      viewCheck: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      readBy: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      isArchived: {
        allowNull: false,
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0',
        validate: {
          isIn: [['0', '1']]
        }
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
    return queryInterface.dropTable('Posts');
  }
};
