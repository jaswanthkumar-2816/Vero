const express = require('express');
const router = express.Router();
const upload = require('../../utils/multer');
const { uploadResumes } = require('./resumes.controller');

router.post('/upload', upload.array('resumes', 100), uploadResumes);

module.exports = router;
