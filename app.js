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
const allRoutes = require('./routes/index');

const errorMiddleware = require('./middlewares/error');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

const options = {
  origin: [
    'https://localhost:3000/',
    'https://les.movies.nomoreparties.sbs/',
  ],
  credentials: true,
};

app.use('*', cors(options));
app.use(express.json());
app.use(requestLogger);
app.use(helmet());

app.use(limiter);

app.use('/', allRoutes);

app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
