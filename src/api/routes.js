const express = require("express");
const coachRoutesV1 = require("./v1/routes");
const routes = express.Router();
routes.use(
  "/v1/coach",
  (req, res, next) => {
    console.log("v1");
    next();
  },
  coachRoutesV1
);

module.exports = routes;
