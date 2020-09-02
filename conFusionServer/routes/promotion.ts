import * as express from "express";
import * as bodyParser from "body-parser";
import Promo from "../model/promotion";

const PromoRoute = express.Router();

PromoRoute.use(bodyParser.json());

PromoRoute.route("/")
  .get((req, res, next) => {
    Promo.find({})
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
  .post((req, res, next) => {
    Promo.create(req.body)
      .then((promo) => {
        console.log("promo Created", promo);
        res.statusCode = 200;
        res.json(promo);
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    Promo.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  });
PromoRoute.route("/:promoId")
  .get((req, res, next) => {
    Promo.findById(req.params.promoId)
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put((req, res, next) => {
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
  .delete((req, res, next) => {
    Promo.findByIdAndRemove(req.params.promoId)
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
      })
      .catch((err) => next(err));
  });

export default PromoRoute;
