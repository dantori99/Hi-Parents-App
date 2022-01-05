const express = require("express");
const router = express.Router();

const {
  registration,
  login,
  updatePassword,
  verifyEmail,
} = require("../controllers/users");

const { loggedIn } = require("../middlewares/auth");

router.route("/register").post(registration);

router.route("/verify").get(verifyEmail);

router.route("/login").post(login);

router.route("/change-password").put(loggedIn, updatePassword);

module.exports = router;
