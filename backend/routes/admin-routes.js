const express = require('express');
const router = express.Router();

const api = require('../api');

router.get('/register-child', api.renderRegChildPage);
router.get('/register-parent', api.renderRegParentPage);
router.get('/register-teacher', api.renderRegTeacherPage);

router.post('/registerChild', api.registerChild);
router.post('/registerParent', api.registerParent);
router.post('/registerTeacher', api.registerTeacher);

module.exports = router;
