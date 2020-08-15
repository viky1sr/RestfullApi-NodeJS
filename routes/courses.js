const express = require('express');
const router = express.Router({mergeParams:true});
const {
    getCourses,
} = require('../controller/CourseController');

router
    .route('/')
    .get(getCourses)
//
// router
//     .route('/:id')
//     .get(getBootcamp)
//     .put(updateBootcamp)
//     .delete(deleteBootcamp)

module.exports = router;