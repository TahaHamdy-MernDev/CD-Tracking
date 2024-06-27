const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateRequest } = require('../utils/validate');
const { registerValidationSchema, loginValidationSchema } = require('../validations/authValidation');

const router = require('express').Router();
router.post('/register', validateRequest(registerValidationSchema), authController.register)
router.post('/login', validateRequest(loginValidationSchema), authController.login)
router.post('/current-user',authenticate , authController.currentUser)
module.exports = router;