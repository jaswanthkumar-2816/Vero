const express = require('express');
const router = express.Router();
const { uploadJD, getJDPreview } = require('./jobDescription.controller');

router.post('/upload', uploadJD);
router.get('/:id/preview', getJDPreview);

module.exports = router;
