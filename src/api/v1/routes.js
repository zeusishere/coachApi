const express = require("express");
const coach = require("./coach");

const coachRoutesV1 = express.Router();

coachRoutesV1.put("/reserve-seats", coach.reserveSeats);
coachRoutesV1.get("/", coach.fetchCoach);
coachRoutesV1.put("/reset", coach.resetCoach);
module.exports = coachRoutesV1;
