const coachDbModel = require("../../dbModel/coach/index");
const {
  search,
  createAvailableSeatsForEmptyCoach,
  markSeatsAsBooked,
} = require("../../helpers/index");

// returns a coach document
const fetchCoach = async (req, res) => {
  try {
    let [coach] = await coachDbModel.findOne();
    //  if coach does not exist, create one
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
    return res.status(501).json({
      success: false,
      message: error.message || "There was an intenal server error",
    });
  }
};

// resets the coach to an empty coach state
const resetCoach = async (req, res) => {
  try {
    const availableSeats = createAvailableSeatsForEmptyCoach();

    const resetDocument = await coachDbModel.updateOne({
      availableSeats,
      bookedSeats: [],
    });

    return res.status(200).json({
      success: true,
      coach: resetDocument,
      message: "coach reset successfully!",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "There was an intenal server error",
    });
  }
};
// reserves the seat in coach
const reserveSeats = async (req, res) => {
  try {
    let { seats } = req.query;
    seats = Number(seats);

    // validates the input to be a number b/w range (1-7]
    if (!typeof seats === "number" || seats <= 0 || seats > 7) {
      const error = new Error(
        "Invalid input. Seats should be whole number greater than 0 and less than 7."
      );
      error.status = 422;
      throw error;
    }
    let [coach] = await coachDbModel.findOne();

    //  if coach does nit exist, create one
    if (!coach) {
      const availableSeats = createAvailableSeatsForEmptyCoach();
      coach = await coachDbModel.create({
        availableSeats,
        bookedSeats: [],
        totalSeats: 80,
      });
      [coach] = await coachDbModel.findOne();
    }
    // stores seats booked in current attempt
    const seatNumbersBooked = [];

    // if enough vacant seats are not available, throw an error to notify user
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

    //  if enogh number of seats are available as a single group in coach,book them
    if (availableSeatsGroupPosition < coach.availableSeats.length) {
      const [availableSeatGroup] = coach.availableSeats.splice(
        availableSeatsGroupPosition,
        1
      );
      // get the first and last booked seat numbers which will be booked
      const firstBookedSeatNumber = availableSeatGroup.startingSeat;
      const lastBookedSeatNumber = firstBookedSeatNumber + seats - 1;
      // now we have to check if availableSeatGroup still has vacant seats , if yes than we create a new seatGroup of required size
      //  and add it to coach.availableSeats
      if (lastBookedSeatNumber < availableSeatGroup.endingSeat) {
        coach.availableSeats.push({
          startingSeat: lastBookedSeatNumber + 1,
          endingSeat: availableSeatGroup.endingSeat,
          seatGroupSize: availableSeatGroup.endingSeat - lastBookedSeatNumber,
        });
      }
      // bookedSeats contains the seats booked in the coach so far
      // seatsBookedInCurrentStep contains the seats booked in current request, used to highlight these seats separately with Orange colour
      const { bookedSeats, seatsBookedInCurrentStep } = markSeatsAsBooked({
        bookedSeats: coach.bookedSeats,
        startSeat: firstBookedSeatNumber,
        endSeat: lastBookedSeatNumber,
      });

      seatNumbersBooked.push(...seatsBookedInCurrentStep);
      coach.bookedSeats = bookedSeats;
    }
    // if there is no available seat group of desired size, we consider two or more seatGroups to book the total seats required
    else {
      // we start with largest seat group, assign the seats and then move to next largest available seat group in loop
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

    return res.status(200).json({ success: true, coach, seatNumbersBooked });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "There was an intenal server error",
    });
  }
};

module.exports = { resetCoach, reserveSeats, fetchCoach };
