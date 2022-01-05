"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class parents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.parents.belongsTo(models.users, {
        foreignKey: "email",
      });

      models.parents.hasMany(models.children, {
        foreignKey: "client_id",
        sourceKey: "client_id",
        targetKey: "client_id",
      });

      // define association here
    }
  }
  parents.init(
    {
      client_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.INTEGER,
      address: DataTypes.STRING,
      job: DataTypes.STRING,
      place_birth: DataTypes.STRING,
      date_birth: DataTypes.DATE,
      gender: DataTypes.STRING,
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "parents",
      timestamps: true,
      paranoid: true,
    }
  );
  return parents;
};
