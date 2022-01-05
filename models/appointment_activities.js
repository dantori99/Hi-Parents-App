"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class appointment_activities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.appointment_activities.belongsTo(models.appointments, {
        foreignKey: "appointment_id",
        targetKey: "appointment_id",
        sourceKey: "appointment_id",
      });
      // define association here
    }
  }
  appointment_activities.init(
    {
      appointment_id: DataTypes.INTEGER,
      activity_detail: DataTypes.STRING,
      photo: DataTypes.STRING,
      time: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "appointment_activities",
      timestamps: true,
      paranoid: true,
    }
  );
  return appointment_activities;
};
