const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); // to protect routes by checking tokens validity.
const HttpError = require("../helpers/http-error");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const User=require("../models/user");

const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "something went wrong on the db, when retriving User"+err,
      500
    );
    return next(error);
  }

  if (user) {
    return res.status(400).json({
      error: "email has already been registerd. Please Login.",
    });
  }
  let newUser;
  if (role == "Teacher") {
    newUser = new Teacher({
      name,
      email,
      password,
      role,
    });
  } else if (role == "Student") {
    newUser = new Student({ name, email, password, role });
  }
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "something went wrong on the db, when saving the user in db"+err,
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // generate a cookie with the token
    res.cookie("token", token, { expiresIn: "1h" });
    // send user details and token to the front end
  } catch (err) {
    const error = new HttpError(
      `sigining up faild, toke creation error!+${err}`,
      500
    );
    return next(error);
  }
  const { _id } = newUser;
  return res.json({
    token,
    user: { _id, name, email, role },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong on server side", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("User does not exsists! Sign up instead.", 500);
    return next(error);
  }
  // Authentication
  if (!user.authenticate(password)) {
    const error = new HttpError("Email password does not match", 500);
    return next(error);
  }
  // generate a token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  // generate a cookie with the token
  res.cookie("token", token, { expiresIn: "1h" });
  // send user details and token to the front end
  const { _id, name, role, balance } = user;

  return res.json({
    token,
    user: { _id, name, email, role, balance },
  });
};

exports.signup = signup;
exports.login = login;
