const express = require('express');
const router = express.Router({mergeParams:true});
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
} = require('../controller/CourseController');

const CourseDB = require('../models/course')
const advanceResults = require('../middleware/advanceResults');

router
    .route('/')
    .get(advanceResults(CourseDB, {
        path: 'bootcamp',
        select: 'name description'
    }),getCourses)
    .post(addCourse)

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router;