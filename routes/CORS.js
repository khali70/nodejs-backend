const express = require("express");
const CORS = require("cors");
const app = express();

/**
 * check for the cors if it match the regex or not
 * @param {string} origin
 * @param {cbOrigin} callback the call back from the filter of the request
 * @returns {boolean}
 */
const filterOrigin = (origin, callback) => {
  // the filter

  const regOrigin = new RegExp(
    /((https|http):\/\/((www|dev)\.)?localhost:?\d*(\.(com|tech))?)/
  );

  // test the origin based on the filter

  if (regOrigin.test(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

/* const corsOptionsDelegate = (req, callback) => {
  
  if (regOrigin.test(req.header("Origin"))) {
    console.log("at Origin " + req.header("Origin") + " allow");
    corsOptions = { origin: true };
  } else {
    console.log("at Origin " + req.header("Origin") + " refused");
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
 */
exports.cors = CORS();
// exports.corsWithOptions = CORS(corsOptionsDelegate);
exports.corsWithOptions = CORS({
  origin: filterOrigin,
});
