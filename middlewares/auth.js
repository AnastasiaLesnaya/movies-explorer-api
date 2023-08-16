const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/Unauthorized');
const { REQUIRE_AUTHORIZATION_MESSAGE } = require('../utils/constants');
const { JWT_SECRET } = require('../utils/config');

const { NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : '🔐');
  } catch (err) {
    next(new UnauthorizedError(REQUIRE_AUTHORIZATION_MESSAGE));
    return;
  }
  req.user = payload;
  next();
};
