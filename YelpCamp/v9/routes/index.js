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
        console.log(err);
        return res.render("register");
      } else {
        passport.authenticate("local")(req,res, function(){
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
  res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
