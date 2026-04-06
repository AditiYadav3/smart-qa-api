const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function registerUser(email, password) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const user = await new User({ email, password }).save();
  return { id: user._id, email: user.email };
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  return { token };
}

module.exports = { registerUser, loginUser };
