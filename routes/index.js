const router = require('express').Router();

const { registerUser, authorizeUser } = require('../controllers/users');
const { validateUserReg, validateUserAuth } = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');

const { pageNotFound } = require('../utils/not_found');

// Роуты
const routerUsers = require('./users');
const routerMovies = require('./movies');

// Регистрация, авторизация (+валидация)
router.post('/signup', validateUserReg, registerUser);
router.post('/signin', validateUserAuth, authorizeUser);
router.use('/', auth);
// Страницы для авторизованных пользователей
router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);
router.post('/signout', (req, res) => {
  res.clearCookie('jwt', { secure: true, sameSite: 'None' }).end();
});
// Несуществующие страницы
router.use('*', auth, pageNotFound);

module.exports = router;
