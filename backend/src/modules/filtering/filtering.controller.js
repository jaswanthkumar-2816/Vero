const mongoose = require('mongoose');
const Candidate = require('../../models/Candidate');

const filterCandidates = async (req, res) => {
    try {
        const query = buildFilterQuery(req.body);
        let candidatesQuery = Candidate.find(query).sort({ matchScore: -1 });
        if (req.body.top10) {
            candidatesQuery = candidatesQuery.limit(10);
        }

        const candidates = await candidatesQuery;
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const exportCandidates = async (req, res) => {
    try {
        const query = buildFilterQuery(req.body);
        let candidatesQuery = Candidate.find(query).sort({ matchScore: -1 });
        if (req.body.top10) {
            candidatesQuery = candidatesQuery.limit(10);
        }

        const candidates = await candidatesQuery;

        // Generate CSV
        const header = ["Name", "ATS Score", "Skills", "Projects", "Internships", "Experience", "Status"];
        const rows = candidates.map(c => [
            `"${c.name}"`,
            `${c.matchScore}%`,
            `"${(c.skills || []).join(', ')}"`,
            `"${(c.projects || []).join(', ')}"`,
            c.internshipCount,
            `${c.experience} years`,
            `"${c.status}"`
        ]);

        const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=candidates_export.csv');
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function buildFilterQuery(body) {
    const {
        jobDescriptionId,
        minMatchScore,
        minSkillCount,
        minProjectCount,
        minHackathonCount,
        minInternshipCount,
        minExperience,
        manualSkill,
        top10
    } = body;

    if (!jobDescriptionId || !mongoose.Types.ObjectId.isValid(jobDescriptionId)) {
        throw new Error('Valid Job Description ID is required');
    }

    let query = { jobDescriptionId: new mongoose.Types.ObjectId(jobDescriptionId) };

    if (!top10) {
        if (minMatchScore) query.matchScore = { $gte: Number(minMatchScore) };
        if (minSkillCount) query.skillCount = { $gte: Number(minSkillCount) };
        if (minProjectCount) query.projectCount = { $gte: Number(minProjectCount) };
        if (minHackathonCount) query.hackathonCount = { $gte: Number(minHackathonCount) };
        if (minInternshipCount) query.internshipCount = { $gte: Number(minInternshipCount) };
        if (minExperience) query.experience = { $gte: Number(minExperience) };

        if (manualSkill) {
            query.skills = { $elemMatch: { $regex: manualSkill, $options: 'i' } };
        }
    }
    return query;
}

module.exports = { filterCandidates, exportCandidates };
