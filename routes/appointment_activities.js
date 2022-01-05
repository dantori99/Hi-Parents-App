const express = require("express");
const router = express.Router();
const {
  createActivity,
  getAllActivityOfEachAppointment,
  getAllChildActivities,
  getAllChildActivitiesFe,
  editActivity,
  deleteActivity,
} = require("../controllers/appointment_activities");

const { loggedIn } = require("../middlewares/auth");

const {
  activitiesValidators,
} = require("../middlewares/validators/appointment_activities");

router.route("/fe").get(getAllChildActivitiesFe);

router.route("/:appointment_id").get(getAllActivityOfEachAppointment);

router.route("/").get(getAllChildActivities);

router.route("/").post(loggedIn, activitiesValidators, createActivity);

router.route("/").put(loggedIn, activitiesValidators, editActivity);

router.route("/").delete(loggedIn, deleteActivity);

module.exports = router;
