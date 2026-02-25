const calculateMatchScore = (candidateData, jdData) => {
    let skillScore = 0;
    let experienceScore = 0;
    let keywordScore = 0;

    // 1. Skill Match (50%)
    if (jdData.requiredSkills && jdData.requiredSkills.length > 0) {
        const matchedSkills = candidateData.skills.filter(skill =>
            jdData.requiredSkills.some(reqSkill =>
                reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(reqSkill.toLowerCase())
            )
        );
        skillScore = (matchedSkills.length / jdData.requiredSkills.length) * 50;
        if (skillScore > 50) skillScore = 50;
    }

    // 2. Experience Match (30%)
    // Simple check: if candidate experience mentioned corresponds to JD expectations
    // This could be more sophisticated with Llama 3 analysis
    const jdYears = parseInt(jdData.experience) || 0;
    const candYears = parseInt(candidateData.yearsOfExperience) || 0;

    if (candYears >= jdYears) {
        experienceScore = 30;
    } else if (candYears > 0) {
        experienceScore = (candYears / jdYears) * 30;
    }

    // 3. Keyword Similarity (20%)
    // Simple check for presence of keywords in the analysis summary or skills
    const keywords = jdData.requiredSkills.map(s => s.toLowerCase());
    const candText = (candidateData.skills.join(' ') + ' ' + candidateData.experience).toLowerCase();

    const keywordMatches = keywords.filter(kw => candText.includes(kw));
    keywordScore = (keywordMatches.length / keywords.length) * 20;
    if (keywordScore > 20) keywordScore = 20;

    return Math.round(skillScore + experienceScore + keywordScore);
};

module.exports = { calculateMatchScore };
