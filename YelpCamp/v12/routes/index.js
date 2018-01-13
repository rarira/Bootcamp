var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    User = require("../models/user"),
    passport = require("passport");


router.get("/",function(req,res){
  res.render("landing");
});

// =================
// AUTH ROUTES
// =================

//show register form
router.get("/register", (req,res) => {
  res.render("register");
});

//handle signup
router.post("/register", (req,res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err,user) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/register");
      } else {
        passport.authenticate("local")(req,res, function(){
          req.flash("success", `Welcome to YelpCamp ${user.username}`);
          res.redirect("/campgrounds");
        });
      }
  });
});

//show login form
router.get("/login", (req,res) => {
  res.render("login");
});

//handle login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req,res) => {
});

//Logout ROUTE
router.get("/logout", (req,res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});


module.exports = router;
