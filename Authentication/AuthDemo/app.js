var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passPortLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");
    app = express();

mongoose.connect("mongodb://localhost/auth_demo_app", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")(
  {
    secret: "Rusty is the best and cutest dog",
    resave: false,
    saveUninitialized: false
  }
));

app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===============
// Routes
// ===============


app.get("/", function(req,res) {
  res.render("home");
});

app.get("/secret", isLoggedIn, function(req,res) {
  res.render("secret");
});

// ===============
// Auth Routes
// ===============

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err,user) {
    if (err) {
      console.log(err);
      return res.render('register');
    } else {
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secret");
      });
    }
  });
});

//LOGIN ROUTES
app.get("/login", function(req,res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local",{
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req,res) {
});

//LOGOUT Routes
app.get("/logout", function(req,res) {
  req.logout();
  res.redirect("/");
});

//Middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

// Run Server
app.listen(3000, function(){
  console.log("THe YelpCamp Server has started!!");
});
