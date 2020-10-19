const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const dishRouter = require("./routes/dishes");
const LeadersRoute = require("./routes/Leaders");
const PromoRoute = require("./routes/promotion");
const User = require("./model/user");
const passport = require("passport");
const authenticate = require("./auth");
require("dotenv").config();

const url = process.env.MONGO_URL;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// > check the connection for any errors
connect.then(
  (db) => {
    console.log("Connected correctly to the server");
  },
  (err) => console.log(err)
);

const app = express();
// Secure traffic only
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
//  view the requests and loggs in the conosle
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//  the secrit key for the cookies
//// app.use(cookieParser("12345-67890-09876-54321"));
/* app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
) */
app.use(passport.initialize());
//// app.use(passport.session());
app.use("/", indexRouter);
app.use("/users", usersRouter);
// PIN: auth
/* app.use((req, res, next) => {
  if (!req.user) {
    const err = new Error("You are not authenticated!");
    err.status = 403;
    return next(err);
  } else {
    next();
  }
}); */
app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);
app.use("/leaders", LeadersRoute);
app.use("/promotions", PromoRoute);

//  catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//  error handler
app.use((err, req, res, next) => {
  //  set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // > render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
