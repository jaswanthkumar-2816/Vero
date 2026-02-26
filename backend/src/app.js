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

const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle missing demo resumes
app.get('/uploads/resumes/:filename', (req, res, next) => {
    const filePath = path.join(__dirname, '../uploads/resumes', req.params.filename);
    if (!fs.existsSync(filePath)) {
        const demoPath = path.join(__dirname, '../uploads/resumes/demo-resume.pdf');
        if (fs.existsSync(demoPath)) {
            return res.sendFile(demoPath);
        }
    }
    next();
});

// Static files for resumes and tester UI
app.use('/uploads/resumes', express.static(path.join(__dirname, '../uploads/resumes')));
app.use('/uploads/jds', express.static(path.join(__dirname, '../uploads/jds')));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/job-description', jobDescriptionRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/filter', filteringRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/demo', demoRoutes);
app.post('/api/seed', seedDatabase);

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;
