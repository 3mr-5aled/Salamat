const mongoose = require("mongoose");

const adminMessageSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderRole: { type: String, enum: ["doctor", "patient"], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminMessage", adminMessageSchema);
