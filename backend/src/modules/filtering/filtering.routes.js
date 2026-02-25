const express = require('express');
const router = express.Router();
const { filterCandidates } = require('./filtering.controller');

router.post('/', filterCandidates);

module.exports = router;
