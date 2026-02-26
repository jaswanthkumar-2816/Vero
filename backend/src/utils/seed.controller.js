const JobDescription = require('../models/JobDescription');
const Candidate = require('../models/Candidate');
const Subscription = require('../models/Subscription');

const sampleJDs = [
    {
        title: "Senior Full Stack Developer",
        description: "Looking for a developer with 5+ years of experience in React, Node.js, and MongoDB.",
        requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript", "Express"],
        experience: "5+ years",
        extractedData: {
            requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript", "Express"],
            experience: "5+ years",
            summary: "Full stack role focusing on MERN stack."
        }
    },
    {
        title: "AI Engineer",
        description: "Experience with Python, LLMs like Llama 3, and vector databases.",
        requiredSkills: ["Python", "Ollama", "Llama 3", "NLP", "PyTorch"],
        experience: "3+ years",
        extractedData: {
            requiredSkills: ["Python", "Ollama", "Llama 3", "NLP", "PyTorch"],
            experience: "3+ years",
            summary: "AI role focused on local LLM deployments."
        }
    }
];

const seedDatabase = async (req, res) => {
    try {
        // Clear existing data
        await JobDescription.deleteMany({});
        await Candidate.deleteMany({});
        await Subscription.deleteMany({});

        const createdJDs = await JobDescription.insertMany(sampleJDs);

        // Generate 500 Sample Candidates for the first JD
        const candidates = [];
        const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah"];
        const lastNames = ["Smith", "Doe", "Johnson", "Brown", "Williams", "Jones", "Miller", "Davis", "Wilson", "Taylor"];
        const skillsList = ["React", "Node.js", "MongoDB", "JavaScript", "Express", "Python", "Docker", "AWS", "Git", "TypeScript"];

        for (let i = 1; i <= 500; i++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const randomSkills = skillsList.sort(() => 0.5 - Math.random()).slice(0, 3);
            const score = Math.floor(Math.random() * 101);

            candidates.push({
                jobDescriptionId: createdJDs[0]._id,
                name: `${fName} ${lName} ${i}`,
                email: `${fName.toLowerCase()}${i}@example.com`,
                phone: `555-${String(i).padStart(4, '0')}`,
                skills: randomSkills,
                experience: Math.floor(Math.random() * 10) + 1,
                resumePath: `uploads/resumes/demo-resume.pdf`,
                matchScore: score,
                status: score > 80 ? 'shortlisted' : (score < 30 ? 'rejected' : 'pending'),
                analysis: {
                    name: `${fName} ${lName} ${i}`,
                    skills: randomSkills,
                    yearsOfExperience: Math.floor(Math.random() * 10) + 1
                }
            });
        }

        await Candidate.insertMany(candidates);

        // Create a demo subscription
        await Subscription.create({
            recruiterId: "demo-recruiter",
            plan: "pro",
            resumeLimit: 1000,
            resumesUsed: 500
        });

        res.json({ message: "Database seeded successfully", jds: createdJDs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { seedDatabase };
