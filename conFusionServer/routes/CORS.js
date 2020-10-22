const express = require("express");
const CORS = require("cors");
const app = express();
const whitlist = ["http://localhost:3000", "https://localhost:3443"];
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
