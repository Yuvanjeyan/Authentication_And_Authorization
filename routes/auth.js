const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../middleware/validation');

router.post('/register', validateRegistration, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.get('/me', authMiddleware.verifyToken, authController.getMe);

module.exports = router;