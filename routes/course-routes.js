const express=require('express');
const { createCourse, getCoursesByAuthorId, getAllCourses, updateCourse, deleteCourse, getCourseById } = require('../controllers/course-controllers');
const { runValidation } = require('../validators');
const { courseCreateValidator } = require('../validators/course-validator');
const router=express.Router();

router.post('/create-course',courseCreateValidator,runValidation,createCourse);
router.get('/get-courses-by-author/:aid',getCoursesByAuthorId);
router.get('/get-all-courses',getAllCourses);
router.patch('/update-course/:cid',updateCourse);
router.delete('/delete-course/:cid',deleteCourse);
router.get('/get-course/:cid',getCourseById);

module.exports=router;