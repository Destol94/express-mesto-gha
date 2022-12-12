const User = require('../models/user');
const { validError, notFoundItem, defaultError } = require('../vendor/constants');

const validationErrorHandler = (err, res) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: validError });
  }
  return res.status(500).json({ message: defaultError });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: defaultError });
  }
};
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: notFoundItem });
    }
    return res.status(200).json(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.name);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: validError });
    }
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: defaultError });
  }
};
const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).json(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: validError });
    }
    return res.status(500).json({ message: defaultError });
  }
};
// eslint-disable-next-line consistent-return
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
// eslint-disable-next-line consistent-return
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
