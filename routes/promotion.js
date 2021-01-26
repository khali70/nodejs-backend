const express = require("express");
const bodyParser = require("body-parser");
const { veirfyUser } = require("../auth");
const Promo = require("../model/promotion");
const { corsWithOptions, cors } = require("./CORS");

const PromoRoute = express.Router();

PromoRoute.use(bodyParser.json());

PromoRoute.route("/")
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Promo.find(req.query)
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(corsWithOptions, veirfyUser, (req, res, next) => {
    Promo.create(req.body)
      .then((promo) => {
        res.statusCode = 200;
        res.json(promo);
      })
      .catch((err) => next(err));
  })
  .put(corsWithOptions, veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete(corsWithOptions, veirfyUser, (req, res, next) => {
    // FIXME add veirfyUser
    // FIXME add req.query
    Promo.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  });
PromoRoute.route("/:promoId")
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Promo.findById(req.params.promoId)
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
      })
      .catch((err) => next(err));
  })
  .post(corsWithOptions, veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put(corsWithOptions, veirfyUser, (req, res, next) => {
    Promo.findByIdAndUpdate(
      req.params.promoId,
      { $set: req.body },
      { new: true }
    )
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
      })
      .catch((err) => next(err));
  })
  .delete(corsWithOptions, veirfyUser, (req, res, next) => {
    Promo.findByIdAndRemove(req.params.promoId)
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
      })
      .catch((err) => next(err));
  });

module.exports = PromoRoute;
