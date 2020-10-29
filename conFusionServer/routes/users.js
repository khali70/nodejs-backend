const express = require("express");
const bodyParser = require("body-parser");
var User = require("../model/user");
const router = express.Router();
const passport = require("passport");
const authenticate = require("../auth");
const { corsWithOptions, cors } = require("./CORS");

router.use(bodyParser.json());
router.options("*", corsWithOptions, (req, res) => res.sendStatus(200));
/* GET users listing. */
router.get(
  "/",
  corsWithOptions,
  authenticate.veirfyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    if (req.user.admin) {
      User.find({})
        .then(
          (users) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(users);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    } else {
      let err = new Error(`only admin can get the Users`);
      err.status = 404;
      return next(err);
    }
  }
);
router.post("/signup", corsWithOptions, (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err });
        var err = new Error(`User ${req.body.username} already exists!`);
        err.status = 403;
        next(err);
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err });
          } else {
            passport.authenticate("local")(req, res, () => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          }
        });
      }
    }
  );
});

router.post("/login", corsWithOptions, (req, res, next) => {
  // prettier-ignore
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);

    } else if (!user) {
      // the user is null and the reason for that is in info so err:info
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    } else {

      req.logIn(user, done = (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});  
        }
        const token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Login Successful!', token});
      });
    }

  })(req, res, next);
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

router.get(
  "/facebook/token",
  passport.authenticate("facebook-token"),
  (req, res) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
  }
);
/**
 * when jwt expire
 */
router.get("/checkJWTToken", corsWithOptions, (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, next) => {
    if (err) {
      return next(err);
    } else if (!user) {
      // the user is null and the reason for that is in info so err:info
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "JWT invalid!", err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, status: "JWT valid!", user });
    }
  })(req, res);
});
module.exports = router;
