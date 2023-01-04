const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, updateProfile, updateAvatar, getInfoAboutMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:me', celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum().length(24),
  }),
}), getInfoAboutMe);
router.get('/:userId', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
