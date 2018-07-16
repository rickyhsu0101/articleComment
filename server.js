const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;


mongoose.connect(MONGODB_URI);

let models = require("./models/index.js");
app.get("/scrape", function(req, res){
  require("./config/articleScraper.js");
  res.redirect("/");
});
app.get("/", function(req, res){
  var hbsob = {
    main: true
  };
  models.article.find({}).then(function(articles){
    //console.log(articles);
    hbsob.stories = articles;
    res.render("index", hbsob);
  }); 
});
app.post("/article/:id/comment", function(req, res){
  models.comment.create({
    user: req.body.user,
    text: req.body.comment
  }).then(function(comment){
    models.article.findByIdAndUpdate(req.params.id, {$push: {comments: comment._id}}, {new: true}).then(function(article){
   //   console.log(article);
      res.redirect("/article/"+req.params.id);
    });
    
  });

});
app.get("/article/:id", function(req, res){
  var hbsob = {
    main: false
  };
  models.article.findOne({_id: req.params.id}).populate("comments").then(function(article){
    console.log(article);
    hbsob.title=article.title;
    hbsob.body = article.body;
    hbsob.comments = article.comments;
    hbsob._id = article._id;
    res.render("index", hbsob);
  });
}); 
app.listen(process.env.PORT || 5000, function () {
  console.log("App listening on 8080");
});