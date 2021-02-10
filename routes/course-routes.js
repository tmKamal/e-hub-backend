const express=require('express');
const { createCourse } = require('../controllers/course-controllers');
const { runValidation } = require('../validators');
const { courseCreateValidator } = require('../validators/course-validator');
const router=express.Router();

router.post('/create-course',courseCreateValidator,runValidation,createCourse);

module.exports=router;