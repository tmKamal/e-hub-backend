const mongoose = require("mongoose");
const User =require("./user");

const options = {discriminatorKey: 'kind'};

const Student = User.discriminator('Student',
  new mongoose.Schema({completed: {
    type: Number,
    default:0,
  }}, options));

module.exports=Student;