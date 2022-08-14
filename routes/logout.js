const express = require("express");
const router = express.Router();

router.post("/", function (req, res) {
  req.logOut();
  res.status(200).clearCookie("sid", {
    path: "/",
  });
  req.session.destroy(function (err) {
    res.redirect("/login"); //Inside a callback… bulletproof!
  });
});

module.exports = router;
