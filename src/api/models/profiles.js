export default (sequelize, DataTypes) => {
  const Profiles = sequelize.define('Profiles', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    firstName: {
      allowNull: true,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: true,
      type: DataTypes.STRING
    },
    phoneNumber: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        not: ['[a-z]', 'i']
      }
    },
    dob: {
      allowNull: true,
      type: DataTypes.STRING
    },
    gender: {
      allowNull: true,
      type: DataTypes.STRING
    },
    initials: {
      allowNull: true,
      type: DataTypes.STRING
    },
    profilePic: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png'
    }
  });

  Profiles.associate = (models) => {
    Profiles.belongsTo(models.Users, {
      foreignKey: 'userId'
    });
  };

  return Profiles;
};
