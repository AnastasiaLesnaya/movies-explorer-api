const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { JWT_SECRET } = require('../utils/config');

// 400
const ValidationError = require('../errors/Validation');
// 401
const UnauthorisedError = require('../errors/Unauthorized');
// 404
const NotFoundError = require('../errors/NotFound');
// 409
const ConflictError = require('../errors/ConflictingRequest');

const {
  NOT_FOUND_USER_MESSAGE,
  BAD_REQUEST_USER_MESSAGE,
  NOT_UNIQUE_USER_MESSAGE,
  UNAUTHORIZED_USER_MESSAGE,
} = require('../utils/constants');

// регистрирация
const registerUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    // пароль не передаётся
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(NOT_UNIQUE_USER_MESSAGE));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError(BAD_REQUEST_USER_MESSAGE));
        return;
      }
      next(err);
    });
};
// обновляем профиль пользователя
const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.userId, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError(NOT_FOUND_USER_MESSAGE);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(BAD_REQUEST_USER_MESSAGE));
      }
      if (err.code === 11000) {
        next(new ConflictError(NOT_UNIQUE_USER_MESSAGE));
      }
      return next(err);
    });
};

// авторизация
const authorizeUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorisedError(UNAUTHORIZED_USER_MESSAGE);
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorisedError(UNAUTHORIZED_USER_MESSAGE);
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          return res.send.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            secure: true,
            sameSite: 'None',
          }).end();
        })
        .catch(next);
    })
    .catch(next);
};

// получение профиля
const getUserInfo = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError(NOT_FOUND_USER_MESSAGE);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(BAD_REQUEST_USER_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports = {
  registerUser,
  updateUserInfo,
  authorizeUser,
  getUserInfo,
};
