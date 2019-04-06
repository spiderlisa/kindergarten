const express = require('express');
const router = express.Router();

const api = require('../api');

router.get('/register-child', api.renderRegChildPage);
router.get('/register-parent', api.renderRegParentPage);
router.get('/register-teacher', api.renderRegTeacherPage);

module.exports = router;