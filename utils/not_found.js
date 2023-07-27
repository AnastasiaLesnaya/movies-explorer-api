const NotFoundError = require('../errors/NotFound');
const { NOT_FOUND_PAGE_MESSAGE } = require('./constants');

const pageNotFound = (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_MESSAGE));
};

module.exports = { pageNotFound };
