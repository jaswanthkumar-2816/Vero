const calculateMatchScore = (candidateData, jdData) => {
    let skillScore = 0;
    let experienceScore = 0;
    let keywordScore = 0;

    const reqSkills = jdData.extractedSkills || [];
    const candSkills = candidateData.skills || [];

    // 1. Skill Match (50%)
    if (reqSkills.length > 0) {
        const matchedSkills = candSkills.filter(skill =>
            reqSkills.some(reqSkill =>
                reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(reqSkill.toLowerCase())
            )
        );
        skillScore = (matchedSkills.length / reqSkills.length) * 50;
        if (skillScore > 50) skillScore = 50;
    }

    // 2. Experience Match (30%)
    const jdYears = jdData.extractedExperience || 0;
    const candYears = candidateData.experience || 0;

    if (jdYears === 0) {
        experienceScore = 30;
    } else if (candYears >= jdYears) {
        experienceScore = 30;
    } else {
        experienceScore = (candYears / jdYears) * 30;
    }

    // 3. Keyword Similarity (20%)
    if (reqSkills.length > 0) {
        const keywords = reqSkills.map(s => s.toLowerCase());
        const candText = (candSkills.join(' ') + ' ' + (candidateData.experience || '')).toLowerCase();
        const keywordMatches = keywords.filter(kw => candText.includes(kw));
        keywordScore = (keywordMatches.length / keywords.length) * 20;
        if (keywordScore > 20) keywordScore = 20;
    }

    return Math.round(skillScore + experienceScore + keywordScore);
};

module.exports = { calculateMatchScore };
