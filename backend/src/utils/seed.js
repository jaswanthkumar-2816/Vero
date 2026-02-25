const mongoose = require('mongoose');
const JobDescription = require('../models/JobDescription');
const Candidate = require('../models/Candidate');
const Subscription = require('../models/Subscription');
require('dotenv').config({ path: '../../.env' });

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

const seedData = async () => {
    try {
        // Determine connection URI
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/vero-ats";
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await JobDescription.deleteMany({});
        await Candidate.deleteMany({});
        await Subscription.deleteMany({});
        console.log("Cleared existing data.");

        // Insert JDs
        const createdJDs = await JobDescription.insertMany(sampleJDs);
        console.log(`Inserted ${createdJDs.length} Job Descriptions.`);

        // Sample Candidates
        const candidates = [
            {
                jobDescriptionId: createdJDs[0]._id,
                name: "John Doe",
                email: "john@example.com",
                phone: "123-456-7890",
                skills: ["React", "Node.js", "JavaScript", "MongoDB"],
                experience: "6 years as a web dev",
                resumePath: "uploads/resumes/sample-john.pdf",
                matchScore: 85,
                status: "shortlisted"
            },
            {
                jobDescriptionId: createdJDs[0]._id,
                name: "Jane Smith",
                email: "jane@example.com",
                phone: "987-654-3210",
                skills: ["React", "CSS", "HTML"],
                experience: "2 years junior dev",
                resumePath: "uploads/resumes/sample-jane.pdf",
                matchScore: 45,
                status: "pending"
            },
            {
                jobDescriptionId: createdJDs[1]._id,
                name: "Alice Johnson",
                email: "alice@ai.com",
                phone: "555-0199",
                skills: ["Python", "Llama 3", "PyTorch"],
                experience: "4 years AI researcher",
                resumePath: "uploads/resumes/sample-alice.pdf",
                matchScore: 92,
                status: "shortlisted"
            }
        ];

        await Candidate.insertMany(candidates);
        console.log(`Inserted ${candidates.length} Candidates.`);

        // Create a demo subscription
        await Subscription.create({
            recruiterId: "demo-recruiter",
            plan: "pro",
            resumeLimit: 500,
            resumesUsed: 3
        });
        console.log("Created demo subscription.");

        console.log("Seeding complete! 🌱");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error.message);
        process.exit(1);
    }
};

seedData();
