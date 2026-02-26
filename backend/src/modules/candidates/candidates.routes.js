const express = require('express');
const router = express.Router();
const { shortlistCandidate, rejectCandidate, getCandidateSummary, batchUpdateStatus } = require('./candidates.controller');

router.post('/:id/shortlist', shortlistCandidate);
router.post('/:id/reject', rejectCandidate);
router.get('/:id/summary', getCandidateSummary);
router.post('/batch-status', batchUpdateStatus);

module.exports = router;
