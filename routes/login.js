const express = require("express");
const loginRouter = express.Router();
const passport = require("passport");

loginRouter.get("/", function (req, res) {
  res.send("login page");
});

loginRouter.post("/", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json(info);
    });
  })(req, res, next);
});

module.exports = loginRouter;
