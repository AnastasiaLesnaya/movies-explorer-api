const { PORT = 3000 } = process.env;

let { JWT_SECRET, MONGODB } = process.env;
if (process.env.NODE_ENV !== 'production') {
  JWT_SECRET = 'dev-secret';
  MONGODB = 'mongodb://127.0.0.1:27017/bitfilmsdb';
}

module.exports = { PORT, MONGODB, JWT_SECRET };
