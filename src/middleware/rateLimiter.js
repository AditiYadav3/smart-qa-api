const rateLimit = require('express-rate-limit');

const askRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user.id,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Rate limit exceeded. Try again in 60 seconds.' },
});

module.exports = { askRateLimiter };
