const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const User = require("../models/user.model");

async function run() {
  try {
    const mongoURI = process.env.db_uri || "mongodb://localhost:27017/salamat";
    console.log("Connecting to Database:", mongoURI);
    await mongoose.connect(mongoURI);
    console.log("Database connected successfully!");

    // 1. Update all users where phone is "" to undefined
    console.log("Locating users with empty phone strings...");
    const res = await User.updateMany(
      { phone: "" },
      { $unset: { phone: 1 } }
    );
    console.log(`Updated ${res.modifiedCount} users to remove empty phone strings.`);

    // 2. Drop existing indexes on phone if they exist
    try {
      console.log("Dropping existing phone indexes...");
      await User.collection.dropIndex("phone_1");
      console.log("Dropped phone_1 index.");
    } catch (e) {
      console.log("No existing phone index found or failed to drop:", e.message);
    }

    // 3. Create unique sparse index
    console.log("Building unique sparse index on phone...");
    await User.collection.createIndex({ phone: 1 }, { unique: true, sparse: true });
    console.log("Phone index successfully built!");

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

run();
