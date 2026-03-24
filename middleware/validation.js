const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('username').trim().notEmpty().withMessage('Username required').isLength({ min: 3 }).withMessage('Min 3 chars'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Min 6 chars').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Need uppercase, lowercase, number'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];

module.exports = {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
};