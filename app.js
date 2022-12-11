const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '639376d66f0c0a4026b9d176',
  };
  next();
});
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

mongoose.set('strictQuery', true);
mongoose.connect(
  'mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
  },
  () => {
    console.log('подключилися к mongooBD');
    app.listen(PORT, () => {
      console.log(`Приложение слушает порт ${PORT}`);
    });
  },
);
