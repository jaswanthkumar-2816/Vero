const Candidate = require('../../models/Candidate');

const filterCandidates = async (req, res) => {
    try {
        const { jobDescriptionId, minScore, skills, minExperience } = req.body;

        let query = { jobDescriptionId };

        if (minScore) {
            query.matchScore = { $gte: minScore };
        }

        if (skills && skills.length > 0) {
            query.skills = { $all: skills.map(s => new RegExp(s, 'i')) };
        }

        // Experience filtering (simplified)
        // In a real app, this might need regex or numeric comparison if extracted correctly
        if (minExperience) {
            query.experience = new RegExp(`${minExperience}`, 'i');
        }

        const candidates = await Candidate.find(query).sort({ matchScore: -1 });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { filterCandidates };
