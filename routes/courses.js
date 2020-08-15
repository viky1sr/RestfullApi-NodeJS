const express = require('express');
const router = express.Router({mergeParams:true});
const {
    getCourses,
    getCourse,
    addCourse,
} = require('../controller/CourseController');

router
    .route('/')
    .get(getCourses)
    .post(addCourse)

router
    .route('/:id')
    .get(getCourse)

module.exports = router;