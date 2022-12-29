const Card = require('../models/card');
const error = require('../utils/constants');
const { checkToken } = require('../utils/token');

const errorHandler = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(error.ERROR_CODE).json({ message: error.validError });
  }
  return res.status(error.ERROR_CODE_SERVER).json({ message: error.defaultError });
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(error.CODE_SUCCESS).json(cards);
  } catch (err) {
    console.error(err);
    return res.status(error.ERROR_CODE_SERVER).json({ message: error.defaultError });
  }
};

const createCard = async (req, res) => {
  const { name, link, _id } = req.body;
  try {
    const card = await Card.create({ name, link, owner: _id });
    return res.status(201).json(card);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(error.ERROR_CODE_NOT_FOUND).json({ message: error.notFoundItem });
    }
    if (`"${req.user._id}"` === JSON.stringify(card.owner._id)) {
      await Card.findByIdAndRemove(cardId);
      return res.status(error.CODE_SUCCESS).json(card);
    }
    return res.status(403).json({ message: 'Ошибка сервера' });
  } catch (err) {
    errorHandler(err, res);
  }
};
const addLikeCard = async (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);
  try {
    const likeCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likeCard) {
      return res.status(error.ERROR_CODE_NOT_FOUND).json({ message: error.notFoundItem });
    }
    return res.status(201).json(likeCard);
  } catch (err) {
    console.log(err);
    errorHandler(err, res);
  }
};

const removeLikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const emptyLike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!emptyLike) {
      return res.status(error.ERROR_CODE_NOT_FOUND).json({ message: error.notFoundItem });
    }
    return res.status(error.CODE_SUCCESS).json(emptyLike);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
};
