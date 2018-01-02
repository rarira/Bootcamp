var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment");


mongoose.connect("mongodb://localhost/yelp_camp_v5", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(`${__dirname}/public`));
seedDB();


app.get("/",function(req,res){
  res.render("landing");
});

//INDEX route
app.get("/campgrounds", function(req,res){
  Campground.find({},function(err,campgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index",{campgrounds});
    }
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

app.get("/campgrounds/:id/comments/new", function(req,res){
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req,res){
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

// Run Server
app.listen(3000, function(){
  console.log("THe YelpCamp Server has started!!");
});
