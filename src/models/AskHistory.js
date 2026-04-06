const mongoose = require('mongoose');

const askHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  sources: [{ type: String }],
  confidence: { type: Number, min: 0, max: 1, required: true },
  latencyMs: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

askHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AskHistory', askHistorySchema);
