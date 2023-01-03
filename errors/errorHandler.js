function errorHandler(err, res) {
  if (err.name === 'ValidationError') {
    console.log('Неверно заполнены поля ввода');
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === 'Unauthorized') {
    console.log('Неверный пользоваетель или пароль');
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === 'ForbiddenError') {
    console.log('Доступ запрещён');
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    console.log('Страница не найдена');
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Ошибка сервера' });
};

exports.module = errorHandler;
