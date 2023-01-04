const Unauthorized = require('../errors/Unauthorized');
const { checkToken } = require('../utils/token');

function checkAuth(req, res, next) {
  const token = req.headers.authorization;
  req.user = checkToken(token);
  if (req.user) {
    return next();
  }
  throw new Unauthorized('Доступ запрещён');
}

module.exports = {
  checkAuth,
};
