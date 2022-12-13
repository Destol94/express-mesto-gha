const validError = 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля';
const notFoundItem = 'карточка или пользователь не найден или был запрошен несуществующий роут';
const defaultError = 'На сервере произошла ошибка';

const CODE_SUCCESS = 200;
const ERROR_CODE = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_SERVER = 500;

module.exports = {
  validError,
  notFoundItem,
  defaultError,
  CODE_SUCCESS,
  ERROR_CODE,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_SERVER,
};
