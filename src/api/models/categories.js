export default (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    desc: {
      allowNull: true,
      type: DataTypes.TEXT
    }
  });

  Categories.associate = (models) => {
    Categories.belongsToMany(models.Posts, {
      through: 'PostCategories',
      as: 'Posts',
      foreignKey: 'categoryId',
      otherKey: 'postId'
    });
  };

  return Categories;
};
