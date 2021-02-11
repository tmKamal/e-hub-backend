const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },

  featuredImage: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Course", CoursesSchema);
