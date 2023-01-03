const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', celebrate({
  body: Joi.object.keys({
    name: Joi.string().required().minlength(2).maxlength(30),
    link: Joi.string().required(),
  }),
}), createCard);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;
