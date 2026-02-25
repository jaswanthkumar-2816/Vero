const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    jobDescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobDescription',
        required: true
    },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    skills: [{ type: String }],
    skillCount: { type: Number, default: 0 },
    projects: [{ type: String }],
    projectCount: { type: Number, default: 0 },
    hackathonCount: { type: Number, default: 0 },
    internshipCount: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    education: { type: String },
    resumePath: { type: String, required: true },
    matchScore: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'shortlisted', 'rejected'],
        default: 'pending'
    },
    analysis: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
