const express = require('express');
const router = express.Router();

const api = require('../api');

//router.post('/create', api.user_create);
//router.post('/send', api.send_email);

router.get('/', api.getSignIn);

module.exports = router;