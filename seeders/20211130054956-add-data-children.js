"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("children", [
      {
<<<<<<< HEAD
        client_id: "P0001",
=======
        client_id: 1,
>>>>>>> origin/parents
        name: faker.name.findName(),
        gender: "Female",
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        photo: faker.image.cats(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
<<<<<<< HEAD
        client_id: "P0002",
=======
        client_id: 2,
>>>>>>> origin/parents
        name: faker.name.findName(),
        gender: "Female",
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        photo: faker.image.food(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
<<<<<<< HEAD
        client_id: "P0003",
=======
        client_id: 3,
>>>>>>> origin/parents
        name: faker.name.findName(),
        gender: "Male",
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        photo: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
<<<<<<< HEAD
        client_id: "P0004",
=======
        client_id: 4,
>>>>>>> origin/parents
        name: faker.name.findName(),
        gender: "Male",
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        photo: faker.image.image(),
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
    await queryInterface.bulkDelete("children", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
