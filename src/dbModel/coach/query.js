const sortAvailableSeatsQuery = () => {
  const query = [
    {
      $project: {
        availableSeats: {
          $sortArray: {
            input: "$availableSeats",
            sortBy: { seatGroupSize: 1 },
          },
        },
        bookedSeats: 1,
        totalSeats: 1,
      },
    },
  ];
  return query;
};

module.exports = { sortAvailableSeatsQuery };
