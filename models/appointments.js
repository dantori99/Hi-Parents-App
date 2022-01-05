"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class appointments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.appointments.belongsTo(models.nannies, {
        foreignKey: "nanny_id",
        sourceKey: "nanny_id",
        targetKey: "nanny_id",
      });

      models.appointments.hasMany(models.appointment_activities, {
        foreignKey: "appointment_id",
        sourceKey: "appointment_id",
        targetKey: "appointment_id",
      });

      models.appointments.belongsTo(models.children, {
        foreignKey: "child_id",
        targetKey: "child_id",
      });

      // define association here
    }
  }
  appointments.init(
    {
      appointment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      date_request: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      child_id: DataTypes.INTEGER,
      appointment_status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      is_taken: DataTypes.BOOLEAN,
      nanny_id: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "appointments",
      timestamps: true,
      paranoid: true,
    }
  );
  return appointments;
};
