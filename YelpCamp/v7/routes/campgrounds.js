var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

//INDEX route
router.get("/", function(req,res){
  Campground.find({},function(err,campgrounds){
    if (err) {
      console.log(err);
    }
      res.render("campgrounds/index",{campgrounds});
  });
});

//CREATE route
router.post("/", function(req,res) {
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
router.get("/new", function(req,res){
  res.render("campgrounds/new");
});

//SHOW route
router.get("/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show",{campground:foundCampground});
    }
  });
});

module.exports = router;
