const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/article");
let models = require("../models/index.js");
models.article.findOne({
  _id: '5b3eaef08a9e580e7cc44581'
}).then(function (art) {
  console.log(art);
});