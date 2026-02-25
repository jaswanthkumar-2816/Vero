const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('./dashboard.controller');

router.get('/:jobDescriptionId', getDashboardAnalytics);

module.exports = router;
