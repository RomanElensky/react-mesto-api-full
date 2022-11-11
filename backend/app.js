const express = require('express');

const app = express();

const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');

const { errors } = require('celebrate');

const bodyParser = require('body-parser');

const { login, postUser } = require('./controllers/users');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { validatePostUser, validateLogin } = require('./middlewares/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    'https://mesto.balrok.nomoredomains.icu',
    'http://mesto.balrok.nomoredomains.icu',
    'https://api.mesto.balrok.nomoredomains.icu',
    'http://api.mesto.balrok.nomoredomains.icu',
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  credentials: true,
}));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validatePostUser, postUser);

app.use(auth);

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Подключен к порту ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(process.env.JWT_SECRET);
  }
});
