export default (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  });

  Roles.associate = (models) => {
    Roles.hasMany(models.Users, {
      foreignKey: 'roleId',
      onDelete: 'cascade'
    });
  };

  return Roles;
};
