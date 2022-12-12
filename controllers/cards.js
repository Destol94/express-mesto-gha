const Card = require('../models/card');
const {
  validError, notFoundItem, defaultError, ERROR_CODE, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER,
} = require('../utils/constants');

const errorHandler = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(ERROR_CODE).json({ message: validError });
  }
  return res.status(ERROR_CODE_SERVER).json({ message: defaultError });
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    return res.status(ERROR_CODE_SERVER).json({ message: defaultError });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user });
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
      return res.status(ERROR_CODE_NOT_FOUND).json({ message: notFoundItem });
    }
    await Card.findByIdAndRemove(cardId);
    return res.status(200).json(card);
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
      return res.status(ERROR_CODE_NOT_FOUND).json({ message: notFoundItem });
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
      return res.status(ERROR_CODE_NOT_FOUND).json({ message: notFoundItem });
    }
    return res.status(200).json(emptyLike);
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
