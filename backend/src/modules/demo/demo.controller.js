const JobDescription = require('../../models/JobDescription');
const Candidate = require('../../models/Candidate');
const Subscription = require('../../models/Subscription');

const loadSampleData = async (req, res) => {
    try {
        console.log("Initializing Universal Demo Mode (500 Multi-Role Candidates)...");
        // 1. Create a Primary Sample Job Description (Full Stack)
        const sampleJD = new JobDescription({
            title: "Senior Technical Lead",
            description: "Experienced leader for modern tech stacks. Expertise in scaling applications and managing data pipelines.",
            extractedSkills: ["Node.js", "Python", "React", "Cloud Architecture"],
            extractedExperience: 5
        });

        await sampleJD.save();

        // 3. Generate 500 Candidates across 4 Archetypes
        const candidates = [];
        const firstNames = ["Aarav", "Priya", "Aryan", "Sanya", "Vihaan", "Ananya", "Ishaan", "Myra", "Arjun", "Kavya", "Siddharth", "Ishani", "Rohan", "Sanjana", "Akash", "Tara", "Varun", "Advait", "Sameer", "Tanvi"];
        const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Reddy", "Iyer", "Singh", "Patel", "Joshi", "Das", "Chopra", "Kapoor", "Trivedi", "Banerjee", "Kulkarni", "Deshmukh", "Pande", "Nair", "Saxena", "Goel"];

        // PRECISE ARCHETYPES to ensure results for ANY JD upload
        const archetypes = [
            {
                name: "Full Stack",
                skills: ["Node.js", "React", "MongoDB", "Express", "TypeScript", "AWS", "Docker"],
                projects: ["Ecommerce Platform", "SaaS Boilerplate", "Real-time Chat Application"]
            },
            {
                name: "Data Scientist", // MATCHING THE USER'S NEW JD
                skills: ["Python", "R", "Machine Learning", "TensorFlow", "Scikit-learn", "Matplotlib", "SQL", "Pandas", "PyTorch", "NLP", "Deep Learning"],
                projects: ["Sales Forecast Engine", "NLP Sentiment Tracker", "Fraud Detection AI System"]
            },
            {
                name: "Backend Engineer",
                skills: ["Go", "Kubernetes", "AWS", "Nginx", "PostgreSQL", "Redis", "Microservices", "gRPC", "Docker"],
                projects: ["High-traffic API Gateway", "Auto-scaling Mesh", "Distributed Cache Service"]
            },
            {
                name: "UI/UX Developer",
                skills: ["Vue.js", "Angular", "Tailwind CSS", "Figma", "D3.js", "Vite", "CSS3", "HTML5", "Sass"],
                projects: ["Interactive Dashboard", "Design System Library", "Portfolio Hub v2"]
            }
        ];

        for (let i = 1; i <= 500; i++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];

            // Cycle through archetypes
            const archetype = archetypes[i % archetypes.length];
            let randomSkills = [...archetype.skills];
            const randomProjects = archetype.projects.sort(() => 0.5 - Math.random()).slice(0, 2);

            // Base match score for the INITIAL demo JD
            let score = Math.floor(Math.random() * 30) + 40;
            if (i <= 60) score = Math.floor(Math.random() * 11) + 88;

            candidates.push({
                jobDescriptionId: sampleJD._id,
                name: `${fName} ${lName}`,
                email: `${fName.toLowerCase()}.${archetype.name.toLowerCase().replace(/ /g, '')}${i}@veroai.demo`,
                skills: randomSkills,
                skillCount: randomSkills.length,
                projects: randomProjects,
                projectCount: randomProjects.length,
                hackathonCount: Math.floor(Math.random() * 6),
                internshipCount: Math.floor(Math.random() * 4),
                experience: Math.floor(Math.random() * 12) + 1,
                matchScore: score,
                status: "pending",
                resumePath: `uploads/resumes/${archetype.name.toLowerCase().replace(/ /g, '-')}-${i}.pdf`
            });
        }

        await Candidate.deleteMany({ email: /@veroai\.demo$/ }); // Clear old demo data
        await Candidate.insertMany(candidates);

        res.status(201).json({
            message: "Universal Demo Data Loaded. 500 Candidates across Data Science, Full Stack, and UI archetypes are ready.",
            jobDescriptionId: sampleJD._id,
            candidateCount: candidates.length,
            jobTitle: sampleJD.title
        });

    } catch (error) {
        console.error("Demo Load Error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { loadSampleData };
