const mongoose = require("mongoose");
const { MONGO_URI } = require("../env.json");

let db = null;

async function connect() {
  try {
    if (db) {
      return db;
    }

    console.log("Creating new database connection...");
    db = await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = {
  connect,
};
