const router = require('express').Router();

const {
  getCards, createCard, deleteCard, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;
