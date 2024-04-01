const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { v4 } = require("uuid");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return done(null, {
          message: "User not found, please sign up first!",
        });
      }

      bcrypt.compare(password, user.password, async function (err, result) {
        if (!result) {
          return done(null, { message: "Wrong Credentials" });
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.CAll_BACK || "http://localhost:8080/user/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const user = await UserModel.findOne({ email: profile._json.email });

        if (user) {
          return cb(null, user);
        }
        // console.log(profile);

        const newUser = await UserModel.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: v4(),
          loginType: "google",
          avatar: profile._json.picture,
          status: "online",
        });

        return cb(null, newUser);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

module.exports = { passport };
