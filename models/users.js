"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.users.hasOne(models.nannies, {
        foreignKey: "email",
      });

      models.users.hasOne(models.parents, {
        foreignKey: "email",
      });
      // define association here
    }
  }
  users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      token: DataTypes.STRING(2000),
      isVerified: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
      timestamps: true,
      paranoid: true,
    }
  );
  return users;
};
