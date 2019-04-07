const express = require('express');
const router = express.Router();

const api = require('../APIs/admin-api');

router.get('/register-child', api.renderRegChildPage);
router.get('/register-parent', api.renderRegParentPage);
router.get('/register-teacher', api.renderRegTeacherPage);
router.get('/new-group', api.renderNewGroupPage);

module.exports = router;