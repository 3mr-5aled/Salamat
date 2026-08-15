const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const AdminMessage = require("../models/adminMessage.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

describe("Admin Messages API", () => {
  let adminUser;
  let adminToken;
  let messageId;

  beforeAll(async () => {
    const mongoUri = process.env.db_uri || process.env.MONGO_URI;
    if (mongoose.connection.readyState === 0 && mongoUri) {
      await mongoose.connect(mongoUri);
    }

    adminUser = await User.create({
      name: "Test Admin",
      email: `testadmin_${Date.now()}@example.com`,
      password: "password123",
      role: "admin",
    });

    adminToken = jwt.sign(
      { userId: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET_KEY || "testsecret",
      { expiresIn: "1h" }
    );

    const msg = await AdminMessage.create({
      senderName: "Dr. Test",
      senderEmail: "drtest@example.com",
      senderRole: "doctor",
      senderId: adminUser._id,
      message: "Test admin message content",
      isRead: false,
    });
    messageId = msg._id;
  }, 30000);

  afterAll(async () => {
    if (adminUser) {
      await User.findByIdAndDelete(adminUser._id);
    }
    if (messageId) {
      await AdminMessage.findByIdAndDelete(messageId);
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  it("GET /api/v1/auth/admin-messages should return messages list for admin", async () => {
    const res = await request(app)
      .get("/api/v1/auth/admin-messages")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("PATCH /api/v1/auth/admin-messages/:id/read should mark message as read", async () => {
    const res = await request(app)
      .patch(`/api/v1/auth/admin-messages/${messageId}/read`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.isRead).toBe(true);
  });

  it("PATCH /api/v1/auth/admin-messages/read-all should mark all messages as read", async () => {
    const res = await request(app)
      .patch("/api/v1/auth/admin-messages/read-all")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("success");
  });
});
