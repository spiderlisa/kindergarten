const express = require('express');
const router = express.Router();

const api = require('../APIs/teacher-api');

router.get('/:teacherId', api.fillTeacherPresence);
router.get('/:teacherId/reviews', api.fillTeacherReviews);

router.post('/markPresence', api.markPresence);
router.post('/:teacherId/addReview', api.addNewReview);


module.exports = router;