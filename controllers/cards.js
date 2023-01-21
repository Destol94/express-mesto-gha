const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const Unauthorized = require('../errors/Unauthorized');
const Card = require('../models/card');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await (await Card.create({ name, link, owner: req.user._id })).populate(['owner', 'likes']);
    return res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      throw new DocumentNotFoundError('Ошибка удаления карточки');
    }
    if (`"${req.user._id}"` === JSON.stringify(card.owner._id)) {
      await Card.findByIdAndRemove(cardId);
      return res.status(200).json(card);
    }
    throw new ForbiddenError('Ошибка удаления');
  } catch (err) {
    next(err);
  }
};
const addLikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const likeCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!likeCard) {
      throw new Unauthorized('Ошибка добавления лайка');
    }
    return res.status(201).json(likeCard);
  } catch (err) {
    next(err);
  }
};

const removeLikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const emptyLike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!emptyLike) {
      throw new Unauthorized('Ошибка удаления лайка');
    }
    return res.status(200).json(emptyLike);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
};
