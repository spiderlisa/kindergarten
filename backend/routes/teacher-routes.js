const express = require('express');
const router = express.Router();

const api = require('../api');

router.get('/:teacherId', api.fillTeacherPresence);

module.exports = router;