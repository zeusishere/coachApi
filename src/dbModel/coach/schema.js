const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema(
  {
    //
    totalSeats: { type: Number, default: 80 },
    availableSeats: [
      {
        startingSeat: { type: Number, required: true },
        endingSeat: { type: Number, required: true },
        seatGroupSize: { type: Number, default: 7 },
      },
    ],
    bookedSeats: [Number],
  },
  { timestamps: true }
);

// const Coach = mongoose.model("Coach", CoachSchema);

module.exports = (db) => {
  return mongoose.model("Coach", CoachSchema);
};
