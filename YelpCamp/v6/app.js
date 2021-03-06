var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp_v6", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(`${__dirname}/public`));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"Rarira is the Sexiest Guy",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
  res.locals.currentUser = req.user;
  next();
});

app.get("/",function(req,res){
  res.render("landing");
});

//INDEX route
app.get("/campgrounds", function(req,res){
  Campground.find({},function(err,campgrounds){
    if (err) {
      console.log(err);
    }
      res.render("campgrounds/index",{campgrounds});
  });
});

//CREATE route
app.post("/campgrounds", function(req,res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name,image,description};
  Campground.create(newCampground, function(err,newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW route
app.get("/campgrounds/new", function(req,res){
  res.render("campgrounds/new");
});

//SHOW route
app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show",{campground:foundCampground});
    }
  });
});


// =================
// COMMENTS ROUTES
// =================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground) {
    if (err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// =================
// AUTH ROUTES
// =================

//show register form
app.get("/register", (req,res) => {
  res.render("register");
});

//handle signup
app.post("/register", (req,res) => {
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
app.get("/login", (req,res) => {
  res.render("login");
});

//handle login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req,res) => {
});

//Logout ROUTE
app.get("/logout", (req,res) => {
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

// Run Server
app.listen(3000, function(){
  console.log("THe YelpCamp Server has started!!");
});
