const db = require("../../singleton/database");
const coachDbModel = require("./schema")(db);
const { sortAvailableSeatsQuery } = require("./query");
const findOne = async () => {
  try {
    const query = sortAvailableSeatsQuery();
    console.log(query);
    const document = await coachDbModel.aggregate(query);
    return document;
  } catch (error) {
    throw error;
  }
};

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
const create = async (object) => {
  try {
    const document = await coachDbModel.create(object);
    console.log("abc", document);
    return document;
  } catch (error) {
    throw error;
  }
};

module.exports = { findOne, updateOne, create };
