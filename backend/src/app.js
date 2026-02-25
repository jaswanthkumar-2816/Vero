const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const jobDescriptionRoutes = require('./modules/jobDescription/jobDescription.routes');
const resumeRoutes = require('./modules/resumes/resumes.routes');
const candidateRoutes = require('./modules/candidates/candidates.routes');
const filteringRoutes = require('./modules/filtering/filtering.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for resumes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/job-description', jobDescriptionRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/filter', filteringRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error fallback
app.get('/', (req, res) => {
    res.json({ message: 'Vero AI Backend API is running' });
});

module.exports = app;
