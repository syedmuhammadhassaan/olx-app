var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index");
});
// ensureAuthenticated,
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     //req.flash('error-msg','You are not logged in');
//     res.redirect("/users/login");
//   }
// }

module.exports = router;