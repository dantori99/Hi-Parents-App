const express = require("express");
const {
  nannyList,
  nannyListSearch,
  getProfileNanny,
  updateProfileNanny,
  activeNannyDashboard,
  nannyListByStatusActive,
  nannyListByStatusInactive,
  childrenNanny,
} = require("../controllers/nannies");
const router = express.Router();
const { updateNannyValidator } = require("../middlewares/validators/nannies");

router.get("/", nannyList);
router.get("/search", nannyListSearch);
router.get("/profile", getProfileNanny);
router.get("/active-nannies", activeNannyDashboard);
router.get("/status-active", nannyListByStatusActive);
router.get("/status-inactive", nannyListByStatusInactive);
router.get("/:nanny_id", childrenNanny);
router.put("/profile", updateNannyValidator, updateProfileNanny);

module.exports = router;
