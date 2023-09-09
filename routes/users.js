const router = require('express').Router();

// Переменные действий с пользователем
const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');

// Валидация
const {
  validateUserUpdate,
} = require('../middlewares/validation');

router.get('/me', getUserInfo);
router.patch('/me', validateUserUpdate, updateUserInfo);

module.exports = router;
