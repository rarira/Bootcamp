const express = require("express"),
      mongoose = require("mongoose"),
      sessions = require("client-sessions"),
      bcrypt = require("bcryptjs"),
      csurf = require("csurf"),
      helmet = require("helmet"),
      bodyParser = require("body-parser");

let app = express();

mongoose.connect("mongodb://localhost/ss-auth");

let User = mongoose.model("User", new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
}));

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(sessions({
  cookieName: "session",
  secret: "woosafd32532wfsf",
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true,
}));
app.use ((req,res,next) => {
  if(!(req.session && req.session.userID)) {
    return next();
  }
  User.findById(req.session.userID, (err,user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next();
    }

    user.password = undefined;

    req.user = user;
    res.locals.user = user;

    next();
  });
});
app.use(csurf());
app.use(helmet());

app.get("/", (req,res) => {
  res.render("index");
});

app.get("/register", (req,res) => {
  res.render("register", {csrfToken: req.csrfToken()});
});

app.post("/register", (req,res) => {
  let hash = bcrypt.hashSync(req.body.password, 14);
  req.body.password = hash;
  let user = new User(req.body);

  user.save((err) => {
    if (err) {
      let error = "Something bad happened! Please try again.";

      if (err.code === 11000) {
        error = "That email is already taken, please try another.";
      }

      return res.render("register", {error});
    }
    req.session.userID = user._id;
    res.redirect("/dashboard");
  });
});

app.get("/login", (req,res) => {
  res.render("login", {csrfToken: req.csrfToken()});
});

app.post("/login", (req,res) => {
  User.findOne({email:req.body.email}, (err,user) => {
    if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.render("login", {error: "Incorrect email/password"});
    }
    res.redirect("/dashboard");
  });
});

app.get("/dashboard",loginRequired,(req,res,next) => {
  // if (!(req.session && req.session.userID)) {
  //   return res.redirect("/login");
  // }
  //
  // User.findById(req.session.userId, (err,user) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (!user) {
  //     return res.redirect("/login");
  //   }
    res.render("dashboard");
  // });
});

function loginRequired(req,res,next) {
  if(!req.user) {
    return res.redirect("/login");
  }
  next();
}


app.listen(3000, function(){
  console.log("Server has started");
});
