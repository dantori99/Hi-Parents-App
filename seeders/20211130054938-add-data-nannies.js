"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("nannies", [
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Dina_Murphy37@yahoo.com",
=======
        email: "Danny31@gmail.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        gender: "Female",
        photo: faker.image.avatar(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Olin84@hotmail.com",
=======
        email: "Travon.Satterfield45@hotmail.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        gender: "Female",
        photo: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Cecelia.McGlynn@hotmail.com",
=======
        email: "Enrique21@gmail.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        gender: "Male",
        photo: faker.image.business(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Reyna8@yahoo.com",
=======
        email: "Turner_OKon@yahoo.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        gender: "Male",
        photo: faker.image.people(),
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
    await queryInterface.bulkDelete("nannies", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
