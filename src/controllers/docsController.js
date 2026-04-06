const Document = require('../models/Document');

async function listDocs(req, res, next) {
  try {
    const docs = await Document.find().select('-__v').sort({ createdAt: -1 });
    res.json({ count: docs.length, docs });
  } catch (err) {
    next(err);
  }
}

module.exports = { listDocs };
