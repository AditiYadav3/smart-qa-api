const AskHistory = require('../models/AskHistory');

async function saveHistory(userId, { question, answer, sources, confidence, latencyMs }) {
  await AskHistory.create({ userId, question, answer, sources, confidence, latencyMs });
}

async function getHistory(userId, limit = 10) {
  return AskHistory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v -userId')
    .lean();
}

module.exports = { saveHistory, getHistory };
