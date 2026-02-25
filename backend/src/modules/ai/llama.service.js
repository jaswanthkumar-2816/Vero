const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const MODEL_NAME = process.env.MODEL_NAME || 'llama3';

const extractJobDescriptionData = async (text) => {
    const prompt = `
    Analyze this Job Description and extract:
    1. A concise job title.
    2. A list of technical skills (languages, frameworks, tools).
    3. Minimum years of experience required (integer). 

    Format: JSON ONLY.
    {
      "title": "Title",
      "extractedSkills": ["Skill 1", "Skill 2"],
      "extractedExperience": 0
    }

    JD:
    ${text}
    `;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
            format: 'json'
        });

        const result = JSON.parse(response.data.response);
        return {
            title: result.title || 'Untitled Job',
            extractedSkills: Array.isArray(result.extractedSkills) ? result.extractedSkills : [],
            extractedExperience: Number(result.extractedExperience) || 0
        };
    } catch (error) {
        console.error('Error calling Ollama for JD:', error.message);
        return { title: 'Untitled Job', extractedSkills: [], extractedExperience: 0 };
    }
};

const extractCandidateData = async (text) => {
    const prompt = `
    Analyze the following resume and extract candidate's information.
    Return only a JSON object with the following structure:
    {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "skills": ["skill1", "skill2"],
      "skillCount": number,
      "projects": ["project description 1", "project description 2"],
      "projectCount": number,
      "hackathonCount": number,
      "internshipCount": number,
      "experience": number
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
