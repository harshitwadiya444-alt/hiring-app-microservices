import fetch from "node-fetch";

export async function parseResumeWithAI(rawText) {
  const prompt = `
You are an ATS resume parser.

Extract ONLY technical skills and project descriptions.

Return STRICT JSON ONLY in this format:
{
  "skills": [],
  "projects": []
}

NO explanations.
NO markdown.
NO extra text.

Resume:
${rawText}
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned empty content");
  }

  console.log("🧠 AI RAW OUTPUT:");
  console.log(content);

  // 🔥 SAFE JSON EXTRACTION
  const match = content.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("AI response does not contain JSON");
  }

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("❌ JSON PARSE FAILED");
    console.error(match[0]);
    throw new Error("AI parsing failed");
  }
}
