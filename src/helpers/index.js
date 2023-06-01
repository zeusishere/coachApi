// performs a binary search on the input array, returns an exact match(array index) for
//  key if present otherwise returns index of next element greater than key
const search = ({ array, low, high, key }) => {
  if (!low) low = 0;
  if (!high) high = array.length - 1;
  let mid,
    midElementSeats,
    greaterElementIndex = array.length;
  while (low <= high) {
    mid = Math.floor(low + (high - low) / 2);
    midElementSeats = getValueOfSeats(array[mid]);
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

// returns the group size
const getValueOfSeats = (seatobject) => {
  return seatobject.seatGroupSize;
};

// contructs the coach structure for an empty coach
// structure : 11 groups of size 7 and one group of size 3
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

// updates bookedSeats with newly added seats from seatGroup
const markSeatsAsBooked = ({ bookedSeats, startSeat, endSeat }) => {
  console.log(startSeat, endSeat);
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
