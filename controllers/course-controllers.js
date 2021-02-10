const Course = require("../models/course");

const createCourse = async (req, res) => {
  const { name, description, slug, featuredImage, price, tags } = req.body;
  let tagsArr=[];
  if (tags) {
     tagsArr = tags.split(",").map((tag) => tag.trim());
  }
  const newCourse = new Course({
    name,
    description,
    slug,
    featuredImage,
    price,
    tags: tagsArr,
  });
  try {
    await newCourse.save();
    return res.status(201).json({
        msg:"course has been created successfully."
    })
  } catch (err) {
    return res.status(500).send('Server issue: '+err);
  }
};

exports.createCourse=createCourse;