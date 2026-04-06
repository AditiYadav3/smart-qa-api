const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { askRateLimiter } = require('../middleware/rateLimiter');
const { ask, getHistory } = require('../controllers/askController');

const router = Router();

router.use(authenticate);
router.post('/', askRateLimiter, ask);
router.get('/history', getHistory);

module.exports = router;
