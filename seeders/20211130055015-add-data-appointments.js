"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("appointments", [
      {
        date_request: new Date(),
        child_id: 68,
        appointment_status: "Accept",
        is_taken: true,
        nanny_id: "N0001",
        is_taken: "True",
        nanny_id: "003",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date_request: new Date(),
        child_id: 6,
        appointment_status: "Accept",
        is_taken: true,
        nanny_id: "N0002",
        child_id: 70,
        appointment_status: "Reject",
        is_taken: "False",
        // nanny_id: "004",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date_request: new Date(),
        child_id: 7,
        appointment_status: "Accept",
        is_taken: false,
        nanny_id: "N0003",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date_request: new Date(),
        child_id: 8,
        appointment_status: "Accept",
        is_taken: false,
        nanny_id: "N0004",
        child_id: 71,
        appointment_status: "Pending",
        // is_taken: "False",
        // nanny_id:  "003",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("appointments", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
