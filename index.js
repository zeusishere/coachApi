const express = require("./src/expressApp");
const db = require("./src/singleton/database");

async function startServer() {
  try {
    await db.connect();
    express.startServer();
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
