const mongoose = require("mongoose");
const User =require("./user");

const options = {discriminatorKey: 'kind'};

const Teacher = User.discriminator('Teacher',
  new mongoose.Schema({coursesCount: {
    type: Number,
    default:0,
  }}, options));

module.exports=Teacher;