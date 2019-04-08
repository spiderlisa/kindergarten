const express = require('express');
const router = express.Router();

const api = require('../APIs/admin-api');

router.get('/register-child', api.renderRegChildPage);
router.get('/register-parent', api.renderRegParentPage);
router.get('/register-teacher', api.renderRegTeacherPage);
router.get('/new-group', api.renderNewGroupPage);
router.get('/bills', api.renderBillsPage);


router.get('/delete-child', api.renderAllChildren);
router.get('/delete-parent', api.renderAllParents);
router.get('/delete-teacher', api.renderAllTeachers);


router.post('/deleteChildren', api.deleteChildren);
router.post('/deleteParents', api.deleteParents);
router.post('/deleteTeachers', api.deleteTeachers);


router.post('/registerChild', api.registerChild);
router.post('/registerParent', api.registerParent);
router.post('/registerTeacher', api.registerTeacher);
router.post('/registerGroup', api.registerGroup);
router.post('/generateBills', api.generateBills);



module.exports = router;
