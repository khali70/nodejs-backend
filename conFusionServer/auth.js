const passport = require("passport");
const LocalStartegy = require("passport-local").Strategy;
const User = require("./model/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
require("dotenv").config(); // ? secretKey && db URL
// ?local startegy: the schema thats add the user to the db
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, process.env.KEY, { expiresIn: 3600 });
};
let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.KEY,
};
// ? the json web token that make the server user the token to handle traffic from both mobile and web
exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
exports.veirfyUser = passport.authenticate("jwt", { session: false });
exports.verifyAdmin = passport.authenticate(
  "jwt",
  function (err, user, info) {
    // TODO add verify admin middle ware
    if (user.admin) {
      return true;
    }
    console.log(user);
  },
  { session: false }
);
