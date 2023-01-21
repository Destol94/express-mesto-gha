const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const {
  createUser, login,
} = require('./controllers/users');
const { checkAuth } = require('./middlewares/auth');
const DocumentNotFoundError = require('./errors/DocumentNotFoundError');
const handlerErrors = require('./utils/handlerErrors');
const corsOptions = require('./utils/corsUtils');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use(requestLogger);
app.use(cookieParser());

app.use('/users', checkAuth, routerUser);
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
}), createUser);
app.use('/cards', checkAuth, routerCard);
app.use('*', () => {
  throw new DocumentNotFoundError('Страница не найдена');
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  handlerErrors(err, req, res, next);
});

mongoose.set('strictQuery', true);
mongoose.connect(
  'mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
  },
  () => {
    app.listen(PORT, () => {
      console.log(`Приложение слушает порт ${PORT}`);
    });
  },
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
