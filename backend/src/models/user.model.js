const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      sparse: true,
      index: true,
      trim: true,
    },
    avatar: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    role: {
      type: String,
      default: "patient",
      enum: ["patient", "doctor", "admin"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  { timestamps: true }
);

// at saving document data in the db
userSchema.pre("save", async function (next) {
  // checking if password is modified
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
