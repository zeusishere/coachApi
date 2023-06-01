const search = ({ array, low, high, key }) => {
  if (!low) low = 0;
  if (!high) high = array.length - 1;
  console.log("key ", key);
  let mid,
    midElementSeats,
    greaterElementIndex = array.length;
  while (low <= high) {
    mid = Math.floor(low + (high - low) / 2);
    midElementSeats = getValueOfSeats(array[mid]);
    console.log("midElementSeats ", midElementSeats, key);
    if (key === midElementSeats) return mid;
    if (key < midElementSeats) {
      high = mid - 1;
      greaterElementIndex = mid;
    } else {
      low = mid + 1;
    }
  }
  return greaterElementIndex;
};

const getValueOfSeats = (seatobject) => {
  return seatobject.seatGroupSize;
};

const createAvailableSeatsForEmptyCoach = () => {
  const availableSeats = [];
  for (let startingSeat = 1; startingSeat <= 80; startingSeat += 7) {
    let endingSeat = startingSeat + 6;
    endingSeat = endingSeat > 80 ? 80 : endingSeat;
    availableSeats.push({
      startingSeat: startingSeat,
      endingSeat,
      seatGroupSize: endingSeat - startingSeat + 1,
    });
  }
  return availableSeats;
};

const markSeatsAsBooked = ({ bookedSeats, startSeat, endSeat }) => {
  const seatsBookedInCurrentStep = [];
  for (; startSeat <= endSeat; startSeat += 1) {
    bookedSeats.push(startSeat);
    seatsBookedInCurrentStep.push(startSeat);
  }
  return { bookedSeats, seatsBookedInCurrentStep };
};
module.exports = {
  createAvailableSeatsForEmptyCoach,
  search,
  markSeatsAsBooked,
};
