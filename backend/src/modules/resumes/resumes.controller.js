const Candidate = require('../../models/Candidate');
const JobDescription = require('../../models/JobDescription');
const Subscription = require('../../models/Subscription');
const { extractCandidateData } = require('../ai/llama.service');
const { calculateMatchScore } = require('../matching/matching.service');
const { extractTextFromFile } = require('../../utils/fileParser');

const uploadResumes = async (req, res) => {
    try {
        const { jobDescriptionId, recruiterId } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const jd = await JobDescription.findById(jobDescriptionId);
        if (!jd) return res.status(404).json({ error: 'Job description not found' });

        // Check subscription
        let subscription = await Subscription.findOne({ recruiterId });
        if (!subscription) {
            subscription = new Subscription({ recruiterId });
            await subscription.save();
        }

        if (subscription.resumesUsed + files.length > subscription.resumeLimit) {
            return res.status(403).json({ error: 'Subscription limit exceeded' });
        }

        const results = [];

        for (const file of files) {
            try {
                const text = await extractTextFromFile(file.path);
                const candidateData = await extractCandidateData(text);

                const matchScore = calculateMatchScore(candidateData, jd);

                const candidate = new Candidate({
                    jobDescriptionId,
                    name: candidateData.name,
                    email: candidateData.email,
                    phone: candidateData.phone,
                    skills: candidateData.skills,
                    skillCount: candidateData.skillCount || 0,
                    projects: candidateData.projects || [],
                    projectCount: candidateData.projectCount || 0,
                    hackathonCount: candidateData.hackathonCount || 0,
                    internshipCount: candidateData.internshipCount || 0,
                    experience: Number(candidateData.experience) || 0,
                    resumePath: file.path,
                    matchScore,
                    analysis: candidateData
                });

                await candidate.save();
                subscription.resumesUsed += 1;
                results.push(candidate);
            } catch (err) {
                console.error(`Error processing file ${file.originalname}:`, err.message);
                // Continue with other files even if one fails
            }
        }

        await subscription.save();
        res.status(201).json({
            message: `${results.length} resumes processed successfully`,
            candidates: results
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadResumes };
