const { signup, login, logout, getCurrentUser } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/AuthValidation');
const authMiddleware = require('../middleware/Auth');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/logout', logout);
// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  res.json({
    success: true,
    user: {
      email: req.user.email,
      _id: req.user._id,
    },
  });
});
module.exports = router;