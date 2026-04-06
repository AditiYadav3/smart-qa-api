const { answerQuestion } = require('../services/ragService');
const { saveHistory, getHistory } = require('../services/historyService');
const { logAskRequest } = require('../middleware/logger');

async function ask(req, res, next) {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      const err = new Error('question is required');
      err.status = 400;
      throw err;
    }

    const result = await answerQuestion(question);

    await saveHistory(req.user.id, result);
    logAskRequest(req.user.id, question, result.latencyMs, result.confidence);

    res.json({
      answer: result.answer,
      sources: result.sources,
      confidence: result.confidence,
    });
  } catch (err) {
    next(err);
  }
}

async function getHistoryHandler(req, res, next) {
  try {
    const history = await getHistory(req.user.id);
    res.json({ count: history.length, history });
  } catch (err) {
    next(err);
  }
}

module.exports = { ask, getHistory: getHistoryHandler };
