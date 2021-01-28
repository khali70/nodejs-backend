/**
 * auth
 */

// passport for auth handler
const passport = require("passport");
/**
 * strategy fo Oauth
 */
// local strategy
const LocalStrategy = require("passport-local").Strategy;
// json web token strategy
const JwtStrategy = require("passport-jwt").Strategy;
// facebook token strategy
const FacebookTokenStrategy = require("passport-facebook-token");

const ExtractJwt = require("passport-jwt").ExtractJwt;

const jwt = require("jsonwebtoken");

// user schema
const User = require("./model/user");
require("dotenv").config();

// add the local strategy to passport
passport.use(new LocalStrategy(User.authenticate()));
// add session auth
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// the generated token
exports.getToken = (user) => {
  return jwt.sign(user, process.env.KEY, { expiresIn: 86400 });
};

/**
 * passport jwt
 * - extractJwt => to extract jwt from auth header as bearer token
 * - strategy => to be add jwt to passport
 */

// the options for json web token strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.KEY,
};

/**
 *
 * add jwt to passport
 *
 * the json web token that make the
 * server use the token to handle
 * traffic from both mobile and web
 */
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

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  } else {
    const error = new Error("Your are not admin to perform this operation");
    err.status = 403;
    return next(error);
  }
};

exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user !== null) {
          return done(null, user);
        } else {
          user = new User({ username: profile.displayName });
          user.facebookId = profile.id;
          user.firstname = profile.name.givenName;
          user.lastname = profile.name.familyName;
          user.save((err, user) => {
            if (err) return done(err, false);
            else return done(null, user);
          });
        }
      });
    }
  )
);
