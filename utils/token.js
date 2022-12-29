const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return false;
  }
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = {
  checkToken,
  generateToken,
};
