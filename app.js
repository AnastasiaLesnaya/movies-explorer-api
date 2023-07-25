require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(limiter);

app.use('/', allRoutes);

app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
