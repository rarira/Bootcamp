var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    data = [
      {
        name: "Cloud's Rest",
        image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
        description: "blah blah blah"
      },
      {
        name: "Desert Mesa",
        image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
        description: "blah blah blah"
      },{
        name: "Canyon Floor",
        image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
        description: "blah blah blah"
      }
    ],
    Comment = require("./models/comment");

function seedDB() {
  Campground.remove({},function(err) {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrouds!");
    data.forEach(function(seed) {
      Campground.create(seed, function(err,campground) {
        if (err) {
          console.log(err);
        } else {
          console.log("added a campground");
          //create a Comment
          Comment.create({
            text: "This place is great, but I wish there was internet",
            author: "Homer"
          },function(err,comment) {
            if (err) {
              console.log(err);
            } else {
              campground.comments.push(comment);
              campground.save();
              console.log("Created new comment");
            }
          });
        }
      });
    });
  });
}

module.exports = seedDB;
