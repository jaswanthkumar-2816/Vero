const mongoose = require('mongoose');
const Candidate = require('../../models/Candidate');

const getDashboardAnalytics = async (req, res) => {
    try {
        const { jobDescriptionId } = req.params;

        const stats = await Candidate.aggregate([
            { $match: { jobDescriptionId: new mongoose.Types.ObjectId(jobDescriptionId) } },
            {
                $group: {
                    _id: null,
                    totalCandidates: { $sum: 1 },
                    shortlistedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "shortlisted"] }, 1, 0] }
                    },
                    rejectedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                    },
                    averageScore: { $avg: "$matchScore" }
                }
            }
        ]);

        const topCandidates = await Candidate.find({ jobDescriptionId })
            .sort({ matchScore: -1 })
            .limit(5);

        res.json({
            analytics: stats[0] || {
                totalCandidates: 0,
                shortlistedCount: 0,
                rejectedCount: 0,
                averageScore: 0
            },
            topCandidates
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDashboardAnalytics };
