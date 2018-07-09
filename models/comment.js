const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

let comment = mongoose.model("Comment", commentSchema);
module.exports = comment;