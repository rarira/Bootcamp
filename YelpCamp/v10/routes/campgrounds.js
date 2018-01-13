var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req,res) {
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
router.get("/new",  middleware.isLoggedIn, function(req,res){
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

//EDIT route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit",{campground: foundCampground});
  });
});

//UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, (req,res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground) => {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

//DESTROY router
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
