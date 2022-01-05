"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("appointment_activities", [
      {
        appointment_id: 26,
        activity_detail: faker.name.jobArea(),
        photo: faker.image.image(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        appointment_id: 27,
        activity_detail: faker.name.jobArea(),
        photo: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        appointment_id: 29,
        activity_detail: faker.name.jobArea(),
        photo: faker.image.animals(),
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
