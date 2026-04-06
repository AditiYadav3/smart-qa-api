const { registerUser, loginUser } = require('../services/authService');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('email and password are required');
      err.status = 400;
      throw err;
    }
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('email and password are required');
      err.status = 400;
      throw err;
    }
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
