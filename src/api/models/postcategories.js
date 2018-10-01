export default (sequelize, DataTypes) => {
  const PostCategories = sequelize.define('PostCategories', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  });

  return PostCategories;
};
