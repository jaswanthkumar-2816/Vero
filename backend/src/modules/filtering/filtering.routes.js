const express = require('express');
const router = express.Router();
const { filterCandidates, exportCandidates } = require('./filtering.controller');

router.post('/', filterCandidates);
router.post('/export', exportCandidates);

module.exports = router;
