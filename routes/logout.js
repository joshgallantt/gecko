const express = require("express");
const logoutRouter = express.Router();

logoutRouter.post("/", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
    return next();
  });
});

module.exports = logoutRouter;
