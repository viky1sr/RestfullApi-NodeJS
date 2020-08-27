const express = require('express');
const router = express.Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampRadius,
    uploadPhotoBootcamp
} = require('../controller/bootcampController');

const BootcampDB = require('../models/bootcamps');
const advanceResults = require('../middleware/advanceResults');

// Include other resource routers
const courseRouter = require('./courses');

// Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampRadius);

router.route('/:id/photo').put(uploadPhotoBootcamp);

router
    .route('/')
    .get(advanceResults(BootcampDB, 'courses'),getBootcamps)
    .post(createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

module.exports = router;