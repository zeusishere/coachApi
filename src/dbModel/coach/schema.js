const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema(
  {
    // total seats in a coach
    totalSeats: { type: Number, default: 80 },
    // list of available groups
    // each group will have  startingSeat ,endingSeat(both seats included) and Group size. each group is known as seatGroup
    availableSeats: [
      {
        startingSeat: { type: Number, required: true },
        endingSeat: { type: Number, required: true },
        seatGroupSize: { type: Number, default: 7 },
      },
    ],
    // list of all seats booked till now
    bookedSeats: [Number],
  },
  { timestamps: true }
);

// const Coach = mongoose.model("Coach", CoachSchema);

module.exports = (db) => {
  return mongoose.model("Coach", CoachSchema);
};
