const db = require("../../singleton/database");
const coachDbModel = require("./schema")(db);
const { sortAvailableSeatsQuery } = require("./query");
// returns a single coach document with seat group sorted in ascending order of seatGroupSize
const findOne = async () => {
  try {
    const query = sortAvailableSeatsQuery();
    const document = await coachDbModel.aggregate(query);
    return document;
  } catch (error) {
    throw error;
  }
};
//  updates single coach document
const updateOne = async (updateObject) => {
  try {
    const document = await coachDbModel.findOneAndUpdate({}, updateObject, {
      new: true,
    });
    return document;
  } catch (error) {
    throw error;
  }
};
// creates an empty coach document
const create = async (object) => {
  try {
    const document = await coachDbModel.create(object);
    return document;
  } catch (error) {
    throw error;
  }
};

module.exports = { findOne, updateOne, create };
