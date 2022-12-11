const User = require('../models/user');

const validationErrorHandler = (err, res) => {
  console.error(err);
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: `${err.message}` });
  }
  return res.status(500).json({ message: `${err.message}` });
}


const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка при получении списка пользователей' })
  }
}
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Такого пользователя нет' });
    }
    return res.status(200).json(user);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
}
const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).json(user);
  }
  catch (err) {
    validationErrorHandler(err, res);
  }
}
const updateProfile = async (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, about }
    )
    return res.status(201).json(user);
  }
  catch (err) {
    validationErrorHandler(err, res);
  }
}
const updateAvatar = async (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar }
    )
    return res.status(201).json(user);
  }
  catch (err) {
    if (!id) {
      res.status(404).json({message: `${err.message}`});
    }
    validationErrorHandler(err, res);
  }
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar
}