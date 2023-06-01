const coachDbModel = require("../../dbModel/coach/index");
const {
  search,
  createAvailableSeatsForEmptyCoach,
  markSeatsAsBooked,
} = require("../../helpers/index");

const fetchCoach = async (req, res) => {
  try {
    let [coach] = await coachDbModel.findOne();
    if (!coach) {
      const availableSeats = createAvailableSeatsForEmptyCoach();
      coach = await coachDbModel.create({
        availableSeats,
        bookedSeats: [],
        totalSeats: 80,
      });
    }
    return res.status(200).json({
      success: true,
      coach: coach,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: error.message || "There was an intenal server error",
    });
  }
};

const resetCoach = async (req, res) => {
  try {
    const availableSeats = createAvailableSeatsForEmptyCoach();

    const resetDocument = await coachDbModel.updateOne({
      availableSeats,
      bookedSeats: [],
    });

    console.log("resetDocument ", resetDocument);

    return res.status(200).json({
      success: true,
      coach: resetDocument,
      message: "coach reset successfully!",
    });
  } catch (error) {
    console.log(error);

    return res.status(501).json({
      success: false,
      message: error.message || "There was an intenal server error",
    });
  }
};

const reserveSeats = async (req, res) => {
  try {
    let { seats } = req.query;
    seats = Number(seats);
    if (!typeof seats === "number" || seats <= 0 || seats > 7) {
      const error = new Error(
        "Invalid input. Seats should be whole number greater than 0 and less than 7."
      );
      error.status = 422;
      throw error;
    }
    let [coach] = await coachDbModel.findOne();

    if (!coach) {
      const availableSeats = createAvailableSeatsForEmptyCoach();
      coach = await coachDbModel.create({
        availableSeats,
        bookedSeats: [],
        totalSeats: 80,
      });
      [coach] = await coachDbModel.findOne();
    }
    //  will contain seats booked in current attempt
    const seatNumbersBooked = [];
    console.log(
      "coach.totalSeats - coach.bookedSeats < seats",
      coach.totalSeats,
      coach.bookedSeats.length,
      seats
    );
    if (coach.totalSeats - coach.bookedSeats.length < seats) {
      const error = new Error(
        "Required number of seats are not vacant in the Coach.Please try with a lower whole number."
      );
      error.status = 422;
      throw error;
    }

    // search method will give the index with exact number of seats if present, otherwise give the index of just next
    // greater group
    const availableSeatsGroupPosition = search({
      array: coach.availableSeats,
      key: seats,
    });

    //  if seats are available as a single group in coach
    // ! wrong
    if (availableSeatsGroupPosition < coach.availableSeats.length) {
      const [availableSeatGroup] = coach.availableSeats.splice(
        availableSeatsGroupPosition,
        1
      );
      console.log("availableSeatsGroupPosition ", availableSeatsGroupPosition);
      // get the first and last booked seat numbers
      const firstBookedSeatNumber = availableSeatGroup.startingSeat;
      const lastBookedSeatNumber = firstBookedSeatNumber + seats - 1;
      // now we have to check if availableSeatGroup still has vacant seats , if yes than add it to coach.availableSeats
      if (lastBookedSeatNumber < availableSeatGroup.endingSeat) {
        coach.availableSeats.push({
          startingSeat: lastBookedSeatNumber + 1,
          endingSeat: availableSeatGroup.endingSeat,
          seatGroupSize: availableSeatGroup.endingSeat - lastBookedSeatNumber,
        });
      }

      const { bookedSeats, seatsBookedInCurrentStep } = markSeatsAsBooked({
        bookedSeats: coach.bookedSeats,
        startSeat: firstBookedSeatNumber,
        endSeat: lastBookedSeatNumber,
      });

      seatNumbersBooked.push(...seatsBookedInCurrentStep);
      coach.bookedSeats = bookedSeats;
      console.log("line 126 coach.bookedSeats ", coach.bookedSeats);
    }
    // there is no available seat group of desired size
    else {
      // we start with largest seat group, assign the seats and then move to next available seat group
      let currentSeatGroupPos = coach.availableSeats.length - 1;
      let currentSeatGroup;
      while (seats > 0 && currentSeatGroupPos >= 0) {
        [currentSeatGroup] = coach.availableSeats.splice(
          currentSeatGroupPos,
          1
        );
        const { bookedSeats, seatsBookedInCurrentStep } = markSeatsAsBooked({
          bookedSeats: coach.bookedSeats,
          startSeat: currentSeatGroup.startingSeat,
          endSeat: currentSeatGroup.endingSeat,
        });

        seatNumbersBooked.push(...seatsBookedInCurrentStep);
        coach.bookedSeats = bookedSeats;

        currentSeatGroupPos -= 1;
        seats -= currentSeatGroup.seatGroupSize;
      }
    }
    coach = await coachDbModel.updateOne(coach);
    console.log("coach ", coach);

    return res.status(200).json({ success: true, coach, seatNumbersBooked });
  } catch (error) {
    console.log(error);

    return res.status(501).json({
      success: false,
      message: error.message || "There was an intenal server error",
    });
  }
};

module.exports = { resetCoach, reserveSeats, fetchCoach };
