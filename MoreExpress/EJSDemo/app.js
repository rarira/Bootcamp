var express = require("express");
var app = express();

app.user(express.static("public"));
app.set("view engine", "ejs");

app.get("/",function(req,res){
  res.render("home");
});

app.get("/fallinlovewith/:thing", function(req,res) {
  var thing=req.params.thing;
  res.render("love", {thingVar: thing});
})

app.listen(3000, function(){
  console.log("Server has started!!");
});
