var express = require("express");
var app = express();

app.get("/", function(req,res) {
  res.send("Hi there, welcome to my assignment!");
})

app.get("/speak/:animal", function(req,res) {
  var crying ;
  switch (req.params.animal) {
    case "pig":
      crying = "'Oink'";
      break;
    case "cow":
      crying = "'Moo'";
      break;
    case "dog":
      crying = "'Woof Woof!'";
      break;
  }
  res.send(`The ${req.params.animal} says ${crying}`);
});

app.get("/repeat/:word/:num", function(req,res) {
  var txt="";
  for (var i=0; i<Number(req.params.num); i++) {
    txt += req.params.word + " ";
  }
  res.send(`${txt}`);
});

app.get("*", function(req,res) {
  res.send("Sorry, page not found...What are you doing with your life?");
})

app.listen(3000, function(){
  console.log("Server has started!!");
});
