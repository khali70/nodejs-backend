const express = require("express");
const CORS = require("cors");
const app = express();
// prettier-ignore
const whitlist = ["http://localhost:3000", "https://localhost:3443","http://eng.khalifa:1250/"];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = CORS();
exports.corsWithOptions = CORS(corsOptionsDelegate);
