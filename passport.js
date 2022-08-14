const LocalStrategy = require("passport-local").Strategy;
const db = require("./database");
const bcrypt = require("bcrypt");

// Passport initialization
const initialize = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          // Checking if user with the given email exists
          const findUser = await db.query(
            "SELECT * FROM account WHERE email = $1",
            [email]
          );
          const user = findUser.rows[0];

          if (!user) {
            return done(null, false, {
              message: "Incorrect Username/Password",
            });
          }

          // Compare provided password with the hashed password in db
          const matched = await bcrypt.compare(password, user.password);

          if (!matched) {
            return done(null, false, {
              message: "Incorrect Username/Password",
            });
          } else {
            return done(null, user, { user: user });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        admin: user.admin,
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};

module.exports = initialize;
