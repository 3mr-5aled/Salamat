const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

module.exports = router;
