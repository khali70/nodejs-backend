const express = require("express");
const CORS = require("cors");
const app = express();

const regOrigin = new RegExp(
  /((https|http):\/\/((www|dev)\.)?localhost:?\d*(\.(com|tech))?)/
);
// ((https|http):\/\/((www|dev)\.)?localhost:?\d*(\.(com|tech))?)(\/\w*\/.*)?/
//whitlist.indexOf(req.header("Origin")) !== -1
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (regOrigin.test(req.header("Origin"))) {
    console.log("at Origin " + req.header("Origin") + " allow");
    corsOptions = { origin: true };
  } else {
    console.log("at Origin " + req.header("Origin") + " refused");
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = CORS();
exports.corsWithOptions = CORS(corsOptionsDelegate);
