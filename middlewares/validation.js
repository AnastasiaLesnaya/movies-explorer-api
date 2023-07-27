const { celebrate, Joi } = require('celebrate');

// Регулярное выражение (ссылки)
const { REGEX } = require('../utils/constants');

// Валидация (регистрация)
const validateUserReg = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

// Валидация (авторизация)
const validateUserAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Валидация (данные пользователя)
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// Валидация (карточки фильмов)
const validateAddMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEX),
    trailerLink: Joi.string().required().pattern(REGEX),
    thumbnail: Joi.string().required().pattern(REGEX),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateUserReg,
  validateUserAuth,
  validateUserUpdate,
  validateAddMovie,
  validateId,
};
