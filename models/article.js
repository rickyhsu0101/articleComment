const mongoose = require("mongoose")
const Schema = mongoose.Schema;
let articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  body: Array
});

let article = mongoose.model("Article", articleSchema);
module.exports = article;