const Card = require('../models/card');

const errorHandler = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: `${err.message}` });
  }
  return res.status(500).json({ message: 'Ошибка при создании карточки' });
}

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка при получении списка карточек' });
  }
}
const createCard = async (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;
  try {
    const card = await Card.create({ name, link, owner: id });
    return res.status(201).json(card);
  }
  catch (err) {
    errorHandler(err, res);
  }
}
const deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const deletCard = await Card.delete(req.body);
    return res.status(201).json(deletCard);
  }
  catch (err) {
    if (!id) {
      return res.status(404).json({ message: `${err.message}` })
    }
    console.error(err);
    return res.status(500).json({ message: 'Ошибка при удалении карточки' });
  }
}
const addLikeCard = async (req, res) => {
  const id = req.params;
  try {
    const likeCard = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.params } },
      { new: true, runValidators: true },
    )
    if (!likeCard) {
      return res.status(400).json({message: 'ошибка при лайке'});
    }
    return res.status(201).json(likeCard);
  }
  catch (err) {
    errorHandler(err, res);
  }
}
const removeLikeCard = async (req, res) => {
  const id = req.params;
  try {
    const emptyLike = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.params } },
      { new: true, runValidators: true }
    )
    if (!emptyLike) {
      return res.status(400).json({message: 'ошибка при лайке'});
    }
    return res.status(201).json(emptyLike);
  }
  catch (err) {
    errorHandler(err, res);
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard
}