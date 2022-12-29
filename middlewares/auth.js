const { checkToken } = require('../utils/token');

function checkAuth(req, res, next) {
  const token = req.headers.authorization;
  req.user = checkToken(token);
  if (req.user) {
    return next();
  }
  return res.status(403).json({ message: 'Доступ запрещён' });
}

module.exports = {
  checkAuth,
};
