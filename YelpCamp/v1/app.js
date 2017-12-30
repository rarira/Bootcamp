var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgrounds = [
  {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
  {name: "Granite HIll", image:"https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
  {name: "Mountain Goat's Rest", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"},
  {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
  {name: "Granite HIll", image:"https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
  {name: "Mountain Goat's Rest", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"},
  {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
  {name: "Granite HIll", image:"https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
  {name: "Mountain Goat's Rest", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"},
  {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
  {name: "Granite HIll", image:"https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
  {name: "Mountain Goat's Rest", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"}
];

app.get("/",function(req,res){
  res.render("landing");
});

app.get("/campgrounds", function(req,res){
  res.render("campgrounds",{campgrounds});
});

app.post("/campgrounds", function(req,res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name,image};
  campgrounds.push(newCampground);
  //redirect back to campgrounds page
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){
  res.render("new");
});

app.listen(3000, function(){
  console.log("THe YelpCamp Server has started!!");
});
