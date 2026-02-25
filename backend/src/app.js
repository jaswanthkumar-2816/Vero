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
const demoRoutes = require('./modules/demo/demo.routes');
const { seedDatabase } = require('./utils/seed.controller');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for resumes and tester UI
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/job-description', jobDescriptionRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/filter', filteringRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/demo', demoRoutes);
app.post('/api/seed', seedDatabase);

// Error fallback
app.get('/', (req, res) => {
    res.json({ message: 'Vero AI Backend API is running' });
});

module.exports = app;
