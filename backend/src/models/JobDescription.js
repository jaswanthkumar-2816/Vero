const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    experience: { type: String },
    extractedData: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
