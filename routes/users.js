const router = require('express').Router();
const {
  getUser, getUsers, updateProfile, updateAvatar, getInfoAboutMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getInfoAboutMe);
router.get('/:userId', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
