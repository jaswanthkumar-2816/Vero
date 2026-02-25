const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const MODEL_NAME = process.env.MODEL_NAME || 'llama3';

const extractJobDescriptionData = async (text) => {
    const prompt = `
    Analyze the following job description and extract the required skills and experience.
    Return only a JSON object with the following structure:
    {
      "requiredSkills": ["skill1", "skill2"],
      "experience": "years of experience required",
      "summary": "brief summary of the role"
    }

    Job Description:
    ${text}
  `;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
            format: 'json'
        });

        return JSON.parse(response.data.response);
    } catch (error) {
        console.error('Error calling Ollama for JD:', error.message);
        throw new Error('AI extraction failed');
    }
};

const extractCandidateData = async (text) => {
    const prompt = `
    Analyze the following resume and extract candidate's name, email, phone, skills, and experience.
    Return only a JSON object with the following structure:
    {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "skills": ["skill1", "skill2"],
      "experience": "Total experience description",
      "yearsOfExperience": number
    }

    Resume:
    ${text}
  `;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
            format: 'json'
        });

        return JSON.parse(response.data.response);
    } catch (error) {
        console.error('Error calling Ollama for Resume:', error.message);
        throw new Error('AI extraction failed');
    }
};

module.exports = {
    extractJobDescriptionData,
    extractCandidateData
};
