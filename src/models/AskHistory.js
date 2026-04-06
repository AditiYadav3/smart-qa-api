const mongoose = require('mongoose');

const askHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  sources: [{ type: String }],
  confidence: { type: String, enum: ['high', 'medium', 'low'], required: true },
  latencyMs: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AskHistory', askHistorySchema);
