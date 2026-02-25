const express = require('express');
const router = express.Router();
const { shortlistCandidate, rejectCandidate } = require('./candidates.controller');

router.post('/:id/shortlist', shortlistCandidate);
router.post('/:id/reject', rejectCandidate);

module.exports = router;
