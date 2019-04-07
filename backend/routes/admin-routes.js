const express = require('express');
const router = express.Router();

const api = require('../APIs/admin-api');

router.get('/register-child', api.renderRegChildPage);
router.get('/register-parent', api.renderRegParentPage);
router.get('/register-teacher', api.renderRegTeacherPage);
router.get('/new-group', api.renderNewGroupPage);

router.post('/registerChild', api.registerChild);
router.post('/registerParent', api.registerParent);
router.post('/registerTeacher', api.registerTeacher);
router.post('/registerGroup', api.registerGroup);



module.exports = router;
