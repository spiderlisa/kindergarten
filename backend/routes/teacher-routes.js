const express = require('express');
const router = express.Router();

const api = require('../APIs/teacher-api');

router.get('/:teacherId', api.fillTeacherPresence);
router.get('/:teacherId/reviews', api.fillTeacherReviews);

router.post('/:teacherId/addReview', api.addNewReview);
router.post('/:teacherId/markPresence', api.markPresence);


module.exports = router;