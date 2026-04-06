function logAskRequest(userId, question, latencyMs, confidence) {
  console.log(JSON.stringify({
    level: 'info',
    event: 'ask_complete',
    userId,
    question: question.slice(0, 100),
    latencyMs,
    confidence,
    timestamp: new Date().toISOString(),
  }));
}

module.exports = { logAskRequest };
