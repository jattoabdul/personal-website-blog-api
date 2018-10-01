export default (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    desc: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    publishedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    viewCheck: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValut: false
    },
    readBy: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    isArchived: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      defaultValue: '0',
      validate: {
        isIn: [['0', '1']]
      }
    }
  });

  Posts.associate = (models) => {
    Posts.belongsToMany(models.Categories, {
      through: 'PostCategories',
      as: 'Categories',
      foreignKey: 'postId',
      otherKey: 'categoryId'
    });

    Posts.belongsTo(models.Users, {
      foreignKey: 'authorId'
    });
  };

  // Posts.afterCreate(async (post) => {
  //   const userProfile = await sequelize.models.PostCategories.create({
  //     postId: post.id,
  //     categoryId: 1
  //   });

  //   if (!userProfile) {
  //     return sequelize.Promise
  //       .reject(new Error('Error occured while creating user profile'));
  //   }
  // });

  return Posts;
};
