const Movie = require('../models/movie');

// 400
const ValidationError = require('../errors/Validation');
// 403
const ForbiddenError = require('../errors/Forbidden');
// 404
 const NotFoundError = require('../errors/NotFound');

const {
  NOT_FOUND_MOVIE_MESSAGE,
  BAD_REQUEST_MOVIE_MESSAGE,
  SUCCESS_DELETED_MOVIE_MESSAGE,
  FORBIDDEN_MESSAGE,
} = require('../utils/constants');


// Получаем карточки фильмов
const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.userId })
    .then((data) => res.send(data))
    .catch(next);
};

// Создаём новые карточки
const addMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.userId })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(BAD_REQUEST_MOVIE_MESSAGE));
        return;
      }
      next(err);
    });
};

// удаляем карточку
const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError(NOT_FOUND_MOVIE_MESSAGE))
    .then((movie) => {
      if (String(movie.owner) !== req.userId) {
        throw new ForbiddenError(FORBIDDEN_MESSAGE);
      }
      return movie.delete();
    })
    .then(() => {
      res.send({ message: SUCCESS_DELETED_MOVIE_MESSAGE });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(BAD_REQUEST_MOVIE_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUserMovies,
  addMovie,
  deleteMovieById,
};