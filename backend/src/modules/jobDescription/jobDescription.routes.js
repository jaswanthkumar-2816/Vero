const express = require('express');
const router = express.Router();
const upload = require('../../utils/multer');
const { uploadJD, getJDPreview } = require('./jobDescription.controller');

router.post('/upload', upload.single('jdFile'), uploadJD);
router.get('/:id/preview', getJDPreview);

module.exports = router;
