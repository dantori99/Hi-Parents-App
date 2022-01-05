require("dotenv").config();

module.exports = {
  development: {
    // username: "haztdnincyjhcr",
    // password:
    //   "133b14df6acd3f6b829c866358c2496c6b1042ae761cb442a5dac205b49b47f9",
    // database: "d768q3o4ssmdv8",
    // host: "ec2-54-198-213-75.compute-1.amazonaws.com",
    // dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // // // },
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    // use_env_variable: {
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: "haztdnincyjhcr",
    password:
      "133b14df6acd3f6b829c866358c2496c6b1042ae761cb442a5dac205b49b47f9",
    database: "d768q3o4ssmdv8",
    host: "ec2-54-198-213-75.compute-1.amazonaws.com",
    dialect: "postgres",
    DATABASE_URL:
      "postgres://haztdnincyjhcr:133b14df6acd3f6b829c866358c2496c6b1042ae761cb442a5dac205b49b47f9@ec2-54-198-213-75.compute-1.amazonaws.com:5432/d768q3o4ssmdv8",
    secret: "123456",
    // use_env_variable: {
    CLOUDINARY_URL:
      "https://res.cloudinary.com/demo/image/upload/w_70,h_53,c_scale/turtles.jpg",
    // },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
