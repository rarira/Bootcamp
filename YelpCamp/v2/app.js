var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite HIll",
//     image:"https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful ganite!"
//   }, function(err,campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }
//   }
// );


app.get("/",function(req,res){
  res.render("landing");
});

app.get("/campgrounds", function(req,res){
  Campground.find({},function(err,campgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("index",{campgrounds});
    }
  });
});

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
  //redirect back to campgrounds page
});

app.get("/campgrounds/new", function(req,res){
  res.render("new");
});

app.get("/campgrounds/:id", function(req,res){
  console.log(req.params.id);
  Campground.findById(req.params.id, function(err, foundCampground) {
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
