/* ===================== COSINE SIMILARITY ===================== */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/* ===================== TOKEN NORMALIZATION ===================== */
function normalizeToken(token) {
  return token
    .toLowerCase()
    .replace(/\.js$/, "")       // react.js -> react
    .replace(/s$/, "")          // apis -> api
    .replace(/[^a-z0-9]/g, ""); // clean symbols
}

/* ===================== RULE-BASED TEXT MATCH ===================== */
function calculateRuleScore(resumeText, jobRequirements) {
  if (!resumeText || jobRequirements.length === 0) {
    return { ruleScore: 0, matched: [] };
  }

  const resumeTokenSet = new Set(
    resumeText
      .toLowerCase()
      .replace(/[^a-z0-9.+]/g, " ")
      .split(/\s+/)
      .map(normalizeToken)
  );

  let matched = [];
  let count = 0;

  for (const req of jobRequirements) {
    const normReq = normalizeToken(req);
    if (resumeTokenSet.has(normReq)) {
      matched.push(req);
      count++;
    }
  }

  return {
    ruleScore: count / jobRequirements.length,
    matched,
  };
}

/* ===================== FINAL MATCH (AI + RULE) ===================== */
export function calculateMatch(
  jobEmbedding,
  resumeEmbedding,
  resumeText,
  requiredSkills = [],
  requiredTools = []
) {
  /* ---------- AI SCORE ---------- */
  const aiScore = cosineSimilarity(jobEmbedding, resumeEmbedding) || 0;

  /* ---------- RULE SCORE ---------- */
  const jobRequirements = [...requiredSkills, ...requiredTools];

  const { ruleScore, matched } = calculateRuleScore(
    resumeText,
    jobRequirements
  );

  /* ---------- FINAL SCORE ---------- */
  const finalScore = 0.4 * aiScore + 0.6 * ruleScore;

  return {
    score: Number(finalScore.toFixed(3)),
    aiScore: Number(aiScore.toFixed(3)),
    ruleScore: Number(ruleScore.toFixed(3)),
    matched,
    isMatch: finalScore >= 0.5,
    isReview : finalScore <=0.5 && finalScore>=0.35, // threshold
  };
}
