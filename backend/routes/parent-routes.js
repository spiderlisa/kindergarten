const express = require('express');
const router = express.Router();

const api = require('../api');

router.get('/:parentId', api.fillParentBills);

module.exports = router;