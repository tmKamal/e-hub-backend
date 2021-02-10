const {check}=require('express-validator');
const courseCreateValidator=[
    check('name').not().isEmpty().withMessage('Name is required')
];
exports.courseCreateValidator=courseCreateValidator;