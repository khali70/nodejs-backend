const { veirfyUser } = require("../auth");
const express = require("express");
const bodyParser = require("body-parser");
const { corsWithOptions, cors } = require("./CORS");
const Feedback = require("../model/feedback");
const feedbackRoute = express.Router();

feedbackRoute.use(bodyParser.json());
// prettier-ignore
feedbackRoute.route("/")
.options(corsWithOptions, (req, res) => {
  res.sendStatus(200);
})
.post(corsWithOptions,veirfyUser,(req,res,next) => {
  const feedback = {...req.body,userId:req.user._id,firstname:req.user.firstname,lastname:req.user.lastname}
  Feedback.create(feedback)
  .then(
    (feedback) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(feedback);
    },
    (err) => next(err)
  )
  .catch((err) => next(err))
})
module.exports = feedbackRoute;
