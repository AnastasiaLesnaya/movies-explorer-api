const router = require('express').Router();

const { registerUser, authorizeUser } = require('../controllers/users');
const { validateUserReg, validateUserAuth } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

const { pageNotFound } = require('../utils/not_found');

// Роуты
const routerUsers = require('./users');
const routerMovies = require('./movies');

// Регистрация, авторизация (+валидация)
router.post('/signup', validateUserReg, registerUser);
router.post('/signin', validateUserAuth, authorizeUser);
// Страницы для авторизованных пользователей
router.use('/', auth);
router.use('/users', routerUsers);
router.use('/movies', routerMovies);
router.post('/signout', (req, res) => {
  res.clearCookie('jwt', { secure: true, sameSite: 'None' }).end();
});
// Несуществующие страницы
router.use('*', pageNotFound);

module.exports = router;
