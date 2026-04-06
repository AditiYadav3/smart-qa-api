const Document = require('../models/Document');

const TOP_N = parseInt(process.env.TOP_N_DOCS, 10) || 3;

async function retrieveDocuments(question, topN = TOP_N) {
  const docs = await Document.find(
    { $text: { $search: question } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(topN)
    .lean();

  return docs;
}

module.exports = { retrieveDocuments };
