export function extractRelevantResumeText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { skills: "", projects: "" };
  }

  /* ---------- 1. SAFE REPAIR (NO DAMAGE) ---------- */
  let text = rawText
    // join only single-letter broken lines (S\nKILLS → SKILLS)
    .replace(/\b([A-Z])\s*\n\s*([A-Z]{2,})\b/g, "$1$2")
    // remove bullets & pipes
    .replace(/[•|]/g, " ")
    // normalize spaces
    .replace(/\n+/g, "\n")
    .replace(/\s+/g, " ")
    .toLowerCase();

  /* ---------- 2. RANGE SLICER ---------- */
  function sliceBetween(startKeys, endKeys) {
    const start = startKeys
      .map(k => text.indexOf(k))
      .filter(i => i !== -1)
      .sort((a, b) => a - b)[0];

    if (start === undefined) return "";

    const afterStart = text.slice(start + 8);

    const end = endKeys
      .map(k => afterStart.indexOf(k))
      .filter(i => i !== -1)
      .sort((a, b) => a - b)[0];

    return end !== undefined ? afterStart.slice(0, end) : afterStart;
  }

  /* ---------- 3. EXTRACT ---------- */
  const skillsText = sliceBetween(
    ["technical skills", "skills"],
    ["projects"]
  );

  const projectsText = sliceBetween(
    ["projects"],
    ["experience", "education", "achievements", "leadership"]
  );

  return {
    skills: skillsText.trim(),
    projects: projectsText.trim(),
  };
}
