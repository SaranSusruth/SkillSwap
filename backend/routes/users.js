const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public Routes
router.get('/', (req, res, next) => {
  const fn = userController.getAllUsers
  if (typeof fn !== 'function') return next(new Error('getAllUsers handler missing'))
  return fn(req, res, next)
})
router.get('/search', (req, res, next) => {
  const fn = userController.searchUsers
  if (typeof fn !== 'function') return next(new Error('searchUsers handler missing'))
  return fn(req, res, next)
})
router.get('/:id/reviews', (req, res, next) => {
  const fn = userController.getUserReviews
  if (typeof fn !== 'function') return next(new Error('getUserReviews handler missing'))
  return fn(req, res, next)
})
router.get('/:id/ratings', (req, res, next) => {
  const fn = userController.getUserRatingSummary
  if (typeof fn !== 'function') return next(new Error('getUserRatingSummary handler missing'))
  return fn(req, res, next)
})
router.get('/:id', (req, res, next) => {
  const fn = userController.getUserById
  if (typeof fn !== 'function') return next(new Error('getUserById handler missing'))
  return fn(req, res, next)
})

// Protected Routes
router.put('/profile', authenticate, (req, res, next) => {
  const fn = userController.updateProfile
  if (typeof fn !== 'function') return next(new Error('updateProfile handler missing'))
  return fn(req, res, next)
})
router.post('/profile/upload', authenticate, upload.single('profileImage'), (req, res, next) => {
  const fn = userController.uploadProfileImage
  if (typeof fn !== 'function') return next(new Error('uploadProfileImage handler missing'))
  return fn(req, res, next)
})
router.post('/:id/reviews', authenticate, (req, res, next) => {
  const fn = userController.createUserReview
  if (typeof fn !== 'function') return next(new Error('createUserReview handler missing'))
  return fn(req, res, next)
})
router.delete('/account', authenticate, (req, res, next) => {
  const fn = userController.deleteAccount
  if (typeof fn !== 'function') return next(new Error('deleteAccount handler missing'))
  return fn(req, res, next)
})

module.exports = router;
