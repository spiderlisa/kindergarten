const express = require('express');
const router = express.Router();

const api = require('../api');

router.get('/:teacherId', api.fillTeacherPresence);
router.get('/:teacherId/reviews', api.fillTeacherReviews);

module.exports = router;