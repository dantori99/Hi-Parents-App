const express = require("express");
const { loggedIn } = require("../middlewares/auth");

const {
  assignChild,
  getManageChild,
  createChildren,
  updateChildren,
  getAllChildren,
  getAllChildActivities,
} = require("../controllers/children");
const { childrenValidators } = require("../middlewares/validators/children");

const router = express.Router();

router
  .route("/")
  .get(getAllChildren)
  .post(loggedIn, childrenValidators, createChildren)
  .put(loggedIn, assignChild);

router.route("/manage").get(getManageChild);

router.route("/dashboard").get(getAllChildActivities);

router.route("/:child_id").put(loggedIn, childrenValidators, updateChildren);

module.exports = router;
