const { PromptTemplate } = require('@langchain/core/prompts');

const TEMPLATE = `You are a helpful assistant. Answer the user's question using ONLY the context provided below.
Do not use any prior knowledge. If the answer cannot be found in the context, say "I don't know based on the available information."

Context:
{context}

Question: {question}

Respond in JSON with this exact shape:
{{"answer": "<your answer>", "sources": ["<doc title>", ...], "confidence": <0.0-1.0>}}`;

const promptTemplate = PromptTemplate.fromTemplate(TEMPLATE);

async function buildPrompt(question, documents) {
  const context = documents
    .map((doc, i) => `[${i + 1}] Title: ${doc.title}\nContent: ${doc.content}`)
    .join('\n\n');

  return promptTemplate.format({ context, question });
}

module.exports = { buildPrompt };
