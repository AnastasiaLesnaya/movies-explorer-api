const allowedCors = [
  'https://api.les.movies.nomoreparties.sbs',
  'https://api.les.movies.nomoreparties.sbs',
  'https://localhost:3000',
  'http://api.les.movies.nomoreparties.sbs',
  'http://api.les.movies.nomoreparties.sbs',
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

module.exports = { cors };