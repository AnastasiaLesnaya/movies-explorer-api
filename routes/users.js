const routerUsers = require('express').Router();

// Переменные действий с пользователем
const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');

// Валидация
const {
  validateUserUpdate,
} = require('../middlewares/validation');

routerUsers.get('/me', getUserInfo);
routerUsers.patch('/me', validateUserUpdate, updateUserInfo);

module.exports = routerUsers;
