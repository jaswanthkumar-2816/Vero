const express = require('express');
const router = express.Router();
const { loadSampleData } = require('./demo.controller');

router.post('/load-sample-data', loadSampleData);

module.exports = router;
