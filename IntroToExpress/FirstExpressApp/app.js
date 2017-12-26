var express = require("express");
var app = express();

app.get("/", function(req,res) {
  res.send("Hi there!");
})

app.get("/bye", function(req,res) {
  res.send("Goodbye!");
})

app.get("/dog", function(req,res) {
  console.log("SOMEONE MADE A REQUEST /dog")
  res.send("MEOW!");
})

app.get("/r/:subredditname", function(req,res){
  console.log(req.params);
  res.send("WELCOME TO SUBREDDIT!");
});

app.get("/r/:subredditname/comments/:id/:title", function(req,res){
  console.log(req.params);
  res.send("WELCOME TO THE COMMENTS PAGE!");
});

app.get("*", function(req,res) {
  res.send("YOU ARE A STAR!!!");
})

app.listen(3000, function(){
  console.log("Server has started!!");
});
