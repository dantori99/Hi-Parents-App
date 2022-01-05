"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class nannies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.nannies.belongsTo(models.users, {
        foreignKey: "email",
      });

      models.nannies.hasMany(models.appointments, {
        foreignKey: "nanny_id",
        sourceKey: "nanny_id",
      });
      // define association here
    }
  }
  nannies.init(
    {
      nanny_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "nannies",
      timestamps: true,
      paranoid: true,
    }
  );
  return nannies;
};
