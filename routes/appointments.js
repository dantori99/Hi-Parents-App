const express = require("express");
const router = express.Router();
const {
  getAppointments,
  getAllAcceptedAppointments,
  createAppointment,
  updateStatus,
  getTotalNewAppointments,
  getAllAppointments,
  getFeAppointmentsSearchChild,
  // getFeAppointmentsSearchParent,
  getFeAppointments,
  getAllAppointmentsSearchChild,
  // getAllAppointmentsSearchParent,
  getFeAppointmentsPending,
  getFeAppointmentsAccepted,
  getAppointmentsDetail,
} = require("../controllers/appointments");

const { useSocket } = require("../middlewares/socket")

const { loggedIn } = require("../middlewares/auth");

router.route("/").get(getAllAppointments);

router.route("/search-child").get(getAllAppointmentsSearchChild);

// router.route("/search-parent").get(getAllAppointmentsSearchParent);

router.route("/fe").get(getFeAppointments);

router.route("/fe/search-child").get(getFeAppointmentsSearchChild);

// router.route("/fe/search-parent").get(getFeAppointmentsSearchParent);

router.route("/fe-pending").get(getFeAppointmentsPending);

router.route("/fe-accepted").get(getFeAppointmentsAccepted);

router.route("/detail/:appointment_id").get(getAppointmentsDetail);

router.route("/dashboard").get(getAppointments);

router.route("/newest").get(getTotalNewAppointments);

router.route("/setStatus").put(updateStatus);

router.route("/accepted").get(getAllAcceptedAppointments);

router.route("/submit").post(loggedIn, useSocket, createAppointment, useSocket);

// router
// // .route('/total')
// // .get(getTotalAppointments)

module.exports = router;
