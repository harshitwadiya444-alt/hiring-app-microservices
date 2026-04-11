import fetch from "node-fetch";

export const getResumeEmbedding = async (text) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/embeddings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ATS Project",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
    }
  );

  const result = await response.json();

  if (!result.data || !result.data[0]?.embedding) {
    throw new Error("Embedding generation failed");
  }

  return result.data[0].embedding; // 1536 length vector
};
