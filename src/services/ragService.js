const { ChatGroq } = require('@langchain/groq');
const { z } = require('zod');
const { retrieveDocuments } = require('./retrievalService');
const { buildPrompt } = require('./promptService');

const TOP_N = parseInt(process.env.TOP_N_DOCS, 10) || 3;
const SCORE_CEILING = 1.5;

const LLMResponseSchema = z.object({
  answer: z.string().min(1),
  sources: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

function computeConfidence(docs) {
  if (!docs.length) return 0;
  const avgScore = docs.reduce((sum, d) => sum + (d.score || 0), 0) / docs.length;
  const scoreFactor = Math.min(1, avgScore / SCORE_CEILING);
  const countFactor = Math.min(1, docs.length / TOP_N);
  return Math.round(countFactor * scoreFactor * 100) / 100;
}

async function answerQuestion(question) {
  const start = Date.now();

  const docs = await retrieveDocuments(question);

  const prompt = await buildPrompt(question, docs);

  const llm = new ChatGroq({
    model: process.env.LLM_MODEL || 'llama-3.1-8b-instant',
    apiKey: process.env.GROQ_API_KEY,
  });

  const response = await llm.invoke(prompt);

  let parsed;
  try {
    // Strip markdown code fences if present
    const raw = response.content.replace(/```json\n?|\n?```/g, '').trim();
    parsed = JSON.parse(raw);
  } catch {
    const err = new Error('LLM returned an invalid response');
    err.status = 502;
    throw err;
  }

  let validated;
  try {
    validated = LLMResponseSchema.parse(parsed);
  } catch {
    const err = new Error('LLM returned an invalid response');
    err.status = 502;
    throw err;
  }

  // Override LLM-generated confidence with retrieval-quality-derived score
  const confidence = computeConfidence(docs);

  return {
    answer: validated.answer,
    sources: validated.sources,
    confidence,
    latencyMs: Date.now() - start,
  };
}

module.exports = { answerQuestion, computeConfidence, LLMResponseSchema };
