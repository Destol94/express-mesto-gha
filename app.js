const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');
const {
  createUser, login,
} = require('./controllers/users');
const { checkAuth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '639376d66f0c0a4026b9d176',
//   };
//   next();
// });
console.log(process.env.JWT_SECRET);
app.use('/users', checkAuth, routerUser);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/cards', checkAuth, routerCard);
app.use('*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Страница не найдена' });
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
