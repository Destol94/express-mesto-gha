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
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), updateAvatar);

module.exports = router;
