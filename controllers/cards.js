const Card = require('../models/card');
const { validError, notFoundItem, defaultError } = require('../vendor/constants');

const errorHandler = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: validError });
  }
  return res.status(500).json({ message: defaultError });
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: defaultError });
  }
};
// eslint-disable-next-line consistent-return
const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user });
    return res.status(201).json(card);
  } catch (err) {
    errorHandler(err, res);
  }
};
// eslint-disable-next-line consistent-return
const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: notFoundItem });
    }
    await Card.findByIdAndRemove(cardId);
    return res.status(200).json(card);
  } catch (err) {
    errorHandler(err, res);
  }
};
// eslint-disable-next-line consistent-return
const addLikeCard = async (req, res) => {
  const { cardId } = req.params;
  // eslint-disable-next-line no-console
  console.log(cardId);
  try {
    const likeCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likeCard) {
      return res.status(404).json({ message: notFoundItem });
    }
    return res.status(201).json(likeCard);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    errorHandler(err, res);
  }
};
// eslint-disable-next-line consistent-return
const removeLikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const emptyLike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!emptyLike) {
      return res.status(404).json({ message: notFoundItem });
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
