const mainRouter = require('express').Router();

const { registerUser, authorizeUser } = require('../controllers/users');
const { validateUserReg, validateUserAuth } = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');

const { pageNotFound } = require('../utils/not_found');

// Роуты
const routerUsers = require('./users');
const routerMovies = require('./movies');

// Регистрация, авторизация (+валидация)
mainRouter.post('/signup', validateUserReg, registerUser);
mainRouter.post('/signin', validateUserAuth, authorizeUser);
mainRouter.use('/', auth);
// Страницы для авторизованных пользователей
mainRouter.use('/users', auth, routerUsers);
mainRouter.use('/movies', auth, routerMovies);
mainRouter.post('/signout', (req, res) => {
  res.clearCookie('jwt', { secure: true, sameSite: 'None' }).end();
});
// Несуществующие страницы
mainRouter.use('*', auth, pageNotFound);

module.exports = mainRouter;
