const bcrypt = require('bcrypt');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const Unauthorized = require('../errors/Unauthorized');
const User = require('../models/user');
const { generateToken } = require('../utils/token');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
const getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new DocumentNotFoundError('Пользователь не найден');
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    return res.status(201).json({ _id: user._id });
  } catch (err) {
    next(err);
  }
};

const getInfoAboutMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new DocumentNotFoundError('Ошибка получения информации о пользователе');
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const body = { ...req.body };
  const { email, password } = body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Unauthorized('неверный пользоваетель или пароль');
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = generateToken({ _id: user._id });
      return res.status(200).cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      }).json({ token });
    }
    throw new Unauthorized('неверный пользоваетель или пароль');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  getUsers,
  getInfoAboutMe,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
