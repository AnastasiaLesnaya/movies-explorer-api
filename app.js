require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

// Защита сервера
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGODB } = require('./utils/config');
// Роуты
const mainRouter = require('./routes/index');

const errorMiddleware = require('./middlewares/error');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());

const options = {
  origin: [
    'http://localhost:3000/',
    'https://les.movies.nomoreparties.sbs/',
    'https://api.les.movies.nomoreparties.sbs/',
    'https://localhost:3000/',
  ],
  allowedHeaders: ['Content-Туре', 'origin', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Accept', 'Set-Cookie'],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  preflightContinue: false,
  credentials: true,
};

app.use('*', cors(options));

app.use(limiter);

app.use(mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
