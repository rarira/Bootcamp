var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");
    // Comment = require("./models/comment"),


mongoose.connect("mongodb://localhost/yelp_camp_v3", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
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
      res.render("index",{campgrounds});
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
  res.render("new");
});

//SHOW route
app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("show",{campground:foundCampground});
    }
  });
});

app.listen(3000, function(){
  console.log("THe YelpCamp Server has started!!");
});
