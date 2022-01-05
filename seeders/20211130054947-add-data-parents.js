"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("parents", [
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Willow28@gmail.com",
=======
        email: "Timmy.Medhurst@yahoo.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        job: faker.name.jobTitle(),
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        gender: "Female",
        photo: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Nat_Bosco@gmail.com",
=======
        email: "Austin.Gerhold@hotmail.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        job: faker.name.jobTitle(),
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        gender: "Female",
        photo: faker.image.avatar(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Fay44@yahoo.com",
=======
        email: "Bert.Borer@gmail.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        job: faker.name.jobTitle(),
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        gender: "Male",
        photo: faker.image.people(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
<<<<<<< HEAD
        email: "Cole65@hotmail.com",
=======
        email: "Shakira.Murazik61@gmail.com",
>>>>>>> origin/parents
        phone_number: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        job: faker.name.jobTitle(),
        place_birth: faker.address.cityName(),
        date_birth: faker.date.past(),
        gender: "Male",
        photo: faker.image.business(),
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
