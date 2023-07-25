const router = require('express').Router();

// Переменные действий с карточками фильмов
const {
  getUserMovies, addMovie, deleteMovieById,
} = require('../controllers/movies');

// Валидация
const {
  validateAddMovie, validateId,
} = require('../middlewares/validation');

router.get('/', getUserMovies);
router.post('/', validateAddMovie, addMovie);
router.delete('/:id', validateId, deleteMovieById);

module.exports = router;
