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
  OK,
  NOT_FOUND_USER_MESSAGE,
  BAD_REQUEST_USER_MESSAGE,
  NOT_UNIQUE_USER_MESSAGE,
  UNAUTHORIZED_USER_MESSAGE,
} = require('../utils/constants');

// регистрирация
const registerUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    res.status(OK).send(user);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(NOT_UNIQUE_USER_MESSAGE));
      return;
    }
    if (err.name === 'ValidationError') {
      next(new ValidationError(BAD_REQUEST_USER_MESSAGE));
      return;
    }
    next(err);
  }
};

// авторизация
const authorizeUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorisedError(UNAUTHORIZED_USER_MESSAGE));
      return;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      next(new UnauthorisedError(UNAUTHORIZED_USER_MESSAGE));
      return;
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.status(OK).cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    }).end();
  } catch (error) {
    next(error);
  }
};

// получение профиля
const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      next(new NotFoundError(NOT_FOUND_USER_MESSAGE));
      return;
    }
    res.status(OK).send(user);
  } catch (err) {
    next(err);
  }
};

// обновляем профиль пользователя
const updateUserInfo = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError(BAD_REQUEST_USER_MESSAGE));
    }
    if (err.code === 11000) {
      next(new ConflictError(NOT_UNIQUE_USER_MESSAGE));
    }
    return next(err);
  }
};

module.exports = {
  registerUser,
  updateUserInfo,
  authorizeUser,
  getUserInfo,
};
