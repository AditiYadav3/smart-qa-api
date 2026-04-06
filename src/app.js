require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

// Routes
app.use('/api/docs', require('./routes/docs'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ask', require('./routes/ask'));

// Central error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

module.exports = app;
