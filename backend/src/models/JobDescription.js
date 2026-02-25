const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    extractedSkills: [{ type: String }],
    extractedExperience: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
