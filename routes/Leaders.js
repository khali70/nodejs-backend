const bodyParser = require("body-parser");
const express = require("express");
const { verifyUser } = require("../auth");
const Leaders = require("../model/leaders");
const { corsWithOptions, cors } = require("./CORS");

const LeadersRoute = express.Router();

LeadersRoute.use(bodyParser.json());

LeadersRoute.route("/")
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Leaders.find(req.query)
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyUser, (req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        res.statusCode = 200;
        res.json(leader);
      })
      .catch((err) => next(err));
  })
  .put(corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete(corsWithOptions, verifyUser, (req, res, next) => {
    // FIXME veirfyadmin
    // FIXME req.query
    Leaders.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  });
LeadersRoute.route("/:leaderId")
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      })
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  })
  .put(corsWithOptions, verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      { $set: req.body },
      { new: true }
    )
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      })
      .catch((err) => next(err));
  })
  .delete(corsWithOptions, verifyUser, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      })
      .catch((err) => next(err));
  });

module.exports = LeadersRoute;
