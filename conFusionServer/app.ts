import * as createError from "http-errors";
import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as mongoose from "mongoose";
import * as session from "express-session";
let FileStore = require("session-file-store")(session); // ! its better to use the import export
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import dishRouter from "./routes/dishes";
import LeadersRoute from "./routes/Leaders";
import PromoRoute from "./routes/promotion";

const url = "mongodb://localhost:2020/conFusion";
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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
//  view the requests and loggs in the conosle
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//  the secrit key for the cookies
//// app.use(cookieParser("12345-67890-09876-54321"));
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// auth
app.use((req, res, next) => {
  console.log(req.signedCookies);
  //  check if the session is saved in the cookies
  if (!req.session.user) {
    // > auth new user
    let err = new createError("You are not authorizoted");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  } else {
    // > check the valid user in the cookies
    if (req.session.user === "authenticated") {
      //  go ahead
      next();
    } else {
      //  error non valid user
      let err = new createError("You are not authorizoted");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 403;
      return next(err);
    }
  }
});
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

export default app;
