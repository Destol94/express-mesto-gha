const User = require('../models/user');
const {
  validError, notFoundItem, defaultError, ERROR_CODE, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER,
} = require('../utils/constants');

const validationErrorHandler = (err, res) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(ERROR_CODE).json({ message: validError });
  }
  return res.status(ERROR_CODE_SERVER).json({ message: defaultError });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(ERROR_CODE_SERVER).json({ message: defaultError });
  }
};
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(ERROR_CODE_NOT_FOUND).json({ message: notFoundItem });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(err.name);
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: validError });
    }
    console.error(err);
    return res.status(ERROR_CODE_SERVER).json({ message: defaultError });
  }
};
const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE).json({ message: validError });
    }
    return res.status(ERROR_CODE_SERVER).json({ message: defaultError });
  }
};

const updateProfile = async (req, res) => {
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
    validationErrorHandler(err, res);
  }
};

const updateAvatar = async (req, res) => {
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
    validationErrorHandler(err, res);
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
};
