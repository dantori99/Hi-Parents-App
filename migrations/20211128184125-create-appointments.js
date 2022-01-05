"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("appointments", {
      appointment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date_request: {
        type: Sequelize.DATE,
      },
      child_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "children",
          key: "child_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      appointment_status: {
        type: Sequelize.STRING,
      },
      is_taken: {
        type: Sequelize.BOOLEAN,
      },
      nanny_id: {
        type: Sequelize.STRING,
        references: {
          model: "nannies",
          key: "nanny_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("appointments");
  },
};
