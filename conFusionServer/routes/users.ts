import * as express from "express";
import * as bodyParser from "body-parser";
import User from "../model/user";
import * as createError from "http-errors";

const router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router
  .get("/", function (req, res, next) {
    res.send("respond with a resource");
  })
  .post("/signup", (req, res, next) => {
    // > sinup Route
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user != null) {
          let err = new createError(`user ${req.body.username} already exists`);
          err.status = 403;
          next(err);
        } else {
          return User.create({
            username: req.body.username,
            password: req.body.password,
            admin: req.body.admin ? req.body.admin : false,
          });
        }
      })
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ status: "Registration Successful", user });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post("/login", (req, res, next) => {
    // > login Route
    if (!req.session.user) {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        const err = new createError("You are not authenticated!");
        res.setHeader("WWW-Authenticate", "Basic");
        err.status = 401;
        return next(err);
      }

      const auth = new Buffer(authHeader.split(" ")[1], "base64")
        .toString()
        .split(":");
      const username = auth[0];
      const password = auth[1];

      User.findOne({ username })
        .then((user) => {
          if (user === null) {
            const err = new createError(`User ${username} does not exist!`);
            err.status = 403;
            return next(err);
          } else if (user.password !== password) {
            const err = new createError("Your password is incorrect!");
            err.status = 403;
            return next(err);
          } else if (user.username === username && user.password === password) {
            req.session.user = "authenticated";
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("You are authenticated!");
          }
        })
        .catch((err) => next(err));
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("You are already authenticated!");
    }
  });

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => next(err));
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new createError("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

export default router;
