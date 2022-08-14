const express = require("express");
const router = express.Router();

router.post("/", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error in Passport Logout Middleware");
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
