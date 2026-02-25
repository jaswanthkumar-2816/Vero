const JobDescription = require('../../models/JobDescription');
const { extractJobDescriptionData } = require('../ai/llama.service');

const uploadJD = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        // Call Llama 3 for extraction
        const extractedData = await extractJobDescriptionData(description);

        const jd = new JobDescription({
            title: title || 'Untitled Job',
            description,
            requiredSkills: extractedData.requiredSkills,
            experience: extractedData.experience,
            extractedData
        });

        await jd.save();
        res.status(201).json(jd);
    } catch (error) {
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
