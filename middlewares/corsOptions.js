const corsOptions = {
  origin: [
    'https://localhost3000/',
    'https://les.movies.nomoreparties.sbs/',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = { corsOptions };
