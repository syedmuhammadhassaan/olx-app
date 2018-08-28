var express = require("express");
var router = express.Router();
var passport = require("passport");
var path = require("path");
var LocalStrategy = require("passport-local").Strategy;
var multer = require("multer");
var GridFsStorage = require("multer-gridfs-storage");
var User = require("../models/user");
var crypto = require("crypto");

var storage = new GridFsStorage({
  url: "mongodb://localhost/loginapp",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const prop = multer({ storage });

router.post("/prop", prop.single("file"), function(req, res) {
  // res.json({ file: req.file });
  res.redirect("/users/prop");
});

router.get("/register", function(req, res) {
  res.render("register");
});

//login route
router.get("/login", function(req, res) {
  res.render("login");
});

//login route
router.post("/register", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody("name", "Name is Required").notEmpty();
  req.checkBody("email", "Email is Required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is Required").notEmpty();
  req.checkBody("password", "password is Required").notEmpty();
  req
    .checkBody("password2", "Passwords does not match")
    .equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      console.log(user);
    });
    req.flash("success_msg", "You are registered and can now login");
    res.redirect("/users/login");
  }
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unkown User" });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "invalid Password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res) {
    res.redirect("/");
  }
);

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

router.get("/prop", function(req, res) {
  res.render("prop");
});

// Connect to the db

module.exports = router;
