const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

function initPassport(passport, getUserByUsername) {
  const authenticate = (username, password, done) => {
    getUserByUsername(username)
      .then(async user => {
        if (user) {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: "The username or password is incorrect." });
          }
        } else {
          return done(null, false, { message: "The username or password is incorrect." });
        }
      });
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  });

  passport.use(new LocalStrategy(authenticate));
}

module.exports = initPassport;