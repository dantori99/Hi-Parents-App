const express = require("express");
const { loggedIn } = require("../middlewares/auth");
const {
  currentAccount,
  dashboardParent,
  updateParent,
  activeClient,
} = require("../controllers/parents");

const { parentValidators } = require("../middlewares/validators/parents");

const router = express.Router();

router.route("/profile").get(loggedIn, currentAccount);

router.route("/dashboard").get(loggedIn, dashboardParent);

router.route("/").put(loggedIn, parentValidators, updateParent);

router.route("/active").get(activeClient);

module.exports = router;
