const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

describe("Notifications API", () => {
  let testUser;
  let userToken;
  let notificationId;

  beforeAll(async () => {
    const mongoUri = process.env.db_uri || process.env.MONGO_URI;
    if (mongoose.connection.readyState === 0 && mongoUri) {
      await mongoose.connect(mongoUri);
    }

    testUser = await User.create({
      name: "Test Patient",
      email: `testnotif_${Date.now()}@example.com`,
      password: "password123",
      role: "patient",
    });

    userToken = jwt.sign(
      { userId: testUser._id, role: testUser.role },
      process.env.JWT_SECRET_KEY || "testsecret",
      { expiresIn: "1h" }
    );

    const notif = await Notification.create({
      recipient: testUser._id,
      title: "Test Title",
      message: "Test Message Content",
      type: "appointment_booked",
    });
    notificationId = notif._id;
  }, 30000);

  afterAll(async () => {
    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }
    if (notificationId) {
      await Notification.findByIdAndDelete(notificationId);
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  it("GET /api/v1/notifications should return notifications list and unread count", async () => {
    const res = await request(app)
      .get("/api/v1/notifications")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.unreadCount).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("PATCH /api/v1/notifications/:id/read should mark notification as read", async () => {
    const res = await request(app)
      .patch(`/api/v1/notifications/${notificationId}/read`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.isRead).toBe(true);
  });
});
