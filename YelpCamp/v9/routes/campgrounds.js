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
router.post("/", isLoggedIn, function(req,res) {
  //get data from form and add to campgrounds array
  var name = req.body.name,
      image = req.body.image,
      description = req.body.description,
      author = {
        id: req.user._id,
        username: req.user.username
      };
  var newCampground = {name,image,description,author};
  Campground.create(newCampground, function(err,newlyCreated){
    if(err){
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

//NEW route
router.get("/new",  isLoggedIn, function(req,res){
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

//middleware
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
