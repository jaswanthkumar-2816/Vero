const mongoose = require('mongoose');
const Candidate = require('../../models/Candidate');
const JobDescription = require('../../models/JobDescription');
const { generateCandidateSummary } = require('../ai/llama.service');

const shortlistCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { status: 'shortlisted' },
            { new: true }
        );
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rejectCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCandidateSummary = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

        const jd = await JobDescription.findById(candidate.jobDescriptionId);
        if (!jd) return res.status(404).json({ error: 'JD not found' });

        const summary = await generateCandidateSummary(candidate, jd);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const batchUpdateStatus = async (req, res) => {
    try {
        const { jobDescriptionId, threshold, operator, status } = req.body;

        if (!jobDescriptionId || !mongoose.Types.ObjectId.isValid(jobDescriptionId)) {
            return res.status(400).json({ error: 'Valid Job Description ID is required' });
        }

        const query = { jobDescriptionId: new mongoose.Types.ObjectId(jobDescriptionId) };
        const scoreLimit = Number(threshold);

        // Map 'gt' to $gte and 'lt' to $lte for more inclusive bulk actions (usually expected by users)
        if (operator === 'gt') query.matchScore = { $gte: scoreLimit };
        else if (operator === 'lt') query.matchScore = { $lte: scoreLimit };

        const result = await Candidate.updateMany(query, { $set: { status } });

        if (result.matchedCount === 0) {
            return res.json({
                message: `No candidates found with score ${operator === 'gt' ? '>=' : '<='} ${threshold}%.`,
                count: 0
            });
        }

        res.json({
            message: `Success! ${result.modifiedCount} candidates were changed to ${status}.`,
            count: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { shortlistCandidate, rejectCandidate, getCandidateSummary, batchUpdateStatus };
