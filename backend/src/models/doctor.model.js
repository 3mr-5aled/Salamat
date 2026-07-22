const mongoose = require("mongoose");
const { setImageURL } = require("../utils/helpers/helper");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      minlength: [3, "Doctor name must be at least 3 characters"],
      maxlength: [100, "Doctor name must be at most 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth: Date,
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clinic",
    },
    qualifications: [String],
    yearsOfExperience: Number,
    profileImage: String,
    availability: [
      {
        dayOfWeek: { type: String, required: true }, // e.g., 'Monday'
        startTime: { type: String, required: true }, // e.g., '09:00'
        endTime: { type: String, required: true }, // e.g., '13:00'
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImg: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);


// findOne, findAll and update
doctorSchema.post("init", (doc) => {
  setImageURL(doc, "doctors", "profileImg");
});

// create
doctorSchema.post("save", (doc) => {
  setImageURL(doc, "doctors", "profileImg");
});

const doctorModel = mongoose.model("doctor", doctorSchema);
module.exports = doctorModel;
