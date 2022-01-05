"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class children extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.children.belongsTo(models.parents, {
        foreignKey: "client_id",
        sourceKey: "client_id",
        targetKey: "client_id"
      });

      models.children.hasOne(models.appointments, {
        foreignKey: "child_id",
      });
      // define association here
    }
  }
  children.init(
    {
      child_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      client_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: DataTypes.STRING,
      gender: DataTypes.STRING,
      place_birth: DataTypes.STRING,
      date_birth: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "children",
      timestamps: true,
      paranoid: true,
    }
  );
  return children;
};
