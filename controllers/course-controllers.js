const Course = require("../models/course");
const slugify = require("slugify");
const HttpError = require("../helpers/http-error");

const getAllCourses=async(req,res,next)=>{
    let courses;
  try {
    courses = await Course.find().populate("author","_id name");
  } catch (err) {
    const error = new HttpError(
      "something went wrong on DB, when retriving courses"+err,
      500
    );
    return next(error);
  }
  res.json({
    courses: courses,
  });
}

const getCourseById=async(req,res,next)=>{
    const courseId=req.params.cid;
    let course;
    try {
        course = await Course.findById(courseId);
      } catch (err) {
        const error = new HttpError(
          "something went wrong on DB, when retriving courses"+err,
          500
        );
        return next(error);
      }
      res.json({
        course: course,
      });
}

const getCoursesByAuthorId = async (req, res,next) => {
  const aid = req.params.aid;
  let authorCourses;
  try {
    authorCourses = await Course.find({author:aid}).populate("author","_id name");
  } catch (err) {
    const error = new HttpError(
      "something went wrong on DB, when finding the given author ID"+err,
      500
    );
    return next(error);
  }

  

  res.json({
    courses: authorCourses,
  });
};

const createCourse = async (req, res) => {
  const { name, description, featuredImage, price, author } = req.body;
  console.log(slugify(name).toLowerCase());
  const slug = slugify(name).toLowerCase();
  const newCourse = new Course({
    name,
    description,
    slug,
    featuredImage,
    price,
    author,
  });
  try {
    let course = await Course.findOne({ slug });
    if (course) {
      return res.status(400).json({
        error:
          "Course with this name is already exists. Please try a differnt one",
      });
    }
    await newCourse.save();
    return res.status(201).json({
      msg: "course has been created successfully.",
    });
  } catch (err) {
    return res.status(500).send("Server issue: " + err);
  }
};

const updateCourse = async (req, res) => {
    const courseId = req.params.cid;
    const { name, description, price } = req.body;
  
    // database check whether doc availble
    let selectedCourse;
    try {
      selectedCourse = await Course.findById(courseId);
      // error handling
      if (selectedCourse == null) {
        return res.status(404).json({
          error: "no courses found by given id",
        });
      }
      // update
      selectedCourse.name = name;
      selectedCourse.price = price;
      selectedCourse.description = description;
      await selectedCourse.save();
      return res.status(202).json({
        msg: "course has been successfully updated",
      });
    } catch (err) {
      return res.status(500).json({
        error: err,
      });
    }
  };
  
  const deleteCourse = async (req, res, next) => {
    const courseId = req.params.cid;
    // find
    let selectedCourse;
    try {
      selectedCourse = await Course.findById(courseId);
      // error handling
      if (selectedCourse == null) {
        return res.status(404).json({
          error: "no course found by give id",
        });
      }
      await selectedCourse.remove();
      return res.status(205).json({
        msg: "course has been successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
      });
    }
  };
  

exports.createCourse = createCourse;
exports.getCoursesByAuthorId=getCoursesByAuthorId;
exports.getAllCourses=getAllCourses;
exports.updateCourse=updateCourse;
exports.deleteCourse=deleteCourse;
exports.getCourseById=getCourseById;