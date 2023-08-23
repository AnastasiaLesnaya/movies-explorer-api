require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

// Защита сервера
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');

const corsOptions = require('./middlewares/corsOptions');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());
app.use(corsOptions);

app.use(limiter);

app.use('/', allRoutes);

app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
