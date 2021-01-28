/***
 * configure express
 */
const express = require("express");
const app = express();

/**
 * routes
 */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const dishRouter = require("./routes/dishes");
const commentsRouter = require("./routes/comments");
const LeadersRoute = require("./routes/Leaders");
const PromoRoute = require("./routes/promotion");
const FavRoute = require("./routes/favorite");
const uploadRouter = require("./routes/uploadRouter");
const feedbackRoute = require("./routes/feedback");

/**
 * passport for login
 */
const passport = require("passport");

/**
 * dev
 */
// to redirect 404 error
const createError = require("http-errors");
// to connect the server
const mongoose = require("mongoose");
// to log the req
const logger = require("morgan");
const path = require("path");
// to use .env data
require("dotenv").config();

// configure connection to the server
const url = process.env.MONGO_URL;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connect to db
connect.then(
  (db) => {
    console.log("Connected correctly to the server");
  },
  (err) => console.log(err)
);

// redirect http to https
app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//  view the requests and logs in the console
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// where to serve the data
app.use(express.static(path.join(__dirname, "public")));

// setup server route
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
app.use("/comments", commentsRouter);
app.use("/leaders", LeadersRoute);
app.use("/promotions", PromoRoute);
app.use("/favorites", FavRoute);
app.use("/feedback", feedbackRoute);
app.use("/imageUpload", uploadRouter);

//  catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//  error handler
app.use((err, req, res, next) => {
  //  set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //  render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
/**
 * connect the reactNative app to the cloud also
 */
