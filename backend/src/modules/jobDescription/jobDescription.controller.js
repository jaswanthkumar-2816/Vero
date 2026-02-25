const JobDescription = require('../../models/JobDescription');
const Candidate = require('../../models/Candidate');
const { extractJobDescriptionData } = require('../ai/llama.service');
const { extractTextFromFile } = require('../../utils/fileParser');
const { calculateMatchScore } = require('../matching/matching.service');

const uploadJD = async (req, res) => {
    try {
        let { title, description } = req.body;
        const file = req.file;

        // If file is uploaded, extract text from it
        if (file) {
            const extractedText = await extractTextFromFile(file.path);
            description = extractedText;
            if (!title) title = file.originalname.split('.')[0];
        }

        if (!description) {
            return res.status(400).json({ error: 'Description or File is required' });
        }

        // Call Llama 3 for extraction
        const extractedData = await extractJobDescriptionData(description);

        const jd = new JobDescription({
            title: title || extractedData.title || 'Untitled Job',
            description,
            extractedSkills: extractedData.extractedSkills,
            extractedExperience: extractedData.extractedExperience
        });

        await jd.save();

        // LOGIC: If we have "Demo" candidates, attach them to this new JD and recalculate scores
        // This is to support the workflow of: Load Demo -> Upload JD -> Filter Demo Resumes
        const demoCandidates = await Candidate.find({ email: /@veroai\.demo$/ });
        if (demoCandidates.length > 0) {
            console.log(`Re-matching ${demoCandidates.length} demo candidates against new JD: ${jd.title}`);

            const bulkOps = demoCandidates.map(cand => {
                const newScore = calculateMatchScore(cand, jd);
                return {
                    updateOne: {
                        filter: { _id: cand._id },
                        update: {
                            $set: {
                                jobDescriptionId: jd._id,
                                matchScore: newScore
                            }
                        }
                    }
                };
            });

            await Candidate.bulkWrite(bulkOps);
        }

        res.status(201).json(jd);
    } catch (error) {
        console.error("JD Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const getJDPreview = async (req, res) => {
    try {
        const jd = await JobDescription.findById(req.params.id);
        if (!jd) return res.status(404).json({ error: 'Not found' });
        res.json(jd);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadJD, getJDPreview };
