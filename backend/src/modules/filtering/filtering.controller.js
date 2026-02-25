const mongoose = require('mongoose');
const Candidate = require('../../models/Candidate');

const filterCandidates = async (req, res) => {
    try {
        const {
            jobDescriptionId,
            minMatchScore,
            minSkillCount,
            minProjectCount,
            minHackathonCount,
            minInternshipCount,
            minExperience,
            manualSkill
        } = req.body;

        if (!jobDescriptionId || !mongoose.Types.ObjectId.isValid(jobDescriptionId)) {
            return res.status(400).json({ error: 'Valid Job Description ID is required' });
        }

        let query = { jobDescriptionId };

        if (minMatchScore) query.matchScore = { $gte: Number(minMatchScore) };
        if (minSkillCount) query.skillCount = { $gte: Number(minSkillCount) };
        if (minProjectCount) query.projectCount = { $gte: Number(minProjectCount) };
        if (minHackathonCount) query.hackathonCount = { $gte: Number(minHackathonCount) };
        if (minInternshipCount) query.internshipCount = { $gte: Number(minInternshipCount) };
        if (minExperience) query.experience = { $gte: Number(minExperience) };

        if (manualSkill) {
            query.skills = { $elemMatch: { $regex: manualSkill, $options: 'i' } };
        }

        const candidates = await Candidate.find(query).sort({ matchScore: -1 });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { filterCandidates };
