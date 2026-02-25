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
    experience: { type: String },
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
