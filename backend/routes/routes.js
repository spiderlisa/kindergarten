const express = require('express');
const router = express.Router();

const api = require('../APIs/auth-api');

router.get('/', api.getSignIn);

module.exports = router;