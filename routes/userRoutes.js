const express = require('express');
const router = express.Router();

const userController = require('../controllers/usersController');
const validateRequest = require('../middleware/validateRequest');
const verifyJWT = require('../middleware/verifyJWT');

const {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
} = require('../schemas/userSchemas');

// 🔐 Middleware global : protège toutes les routes
router.use(verifyJWT);

// 👥 Route principale : /users
router.get('/', userController.getAllUsers);
router.post('/', validateRequest(createUserSchema), userController.createNewUser);

// 🛠️ Routes paramétrées : /users/:id
router.patch(
  '/:id',
  validateRequest(userIdParamSchema, 'params'),
  validateRequest(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  validateRequest(userIdParamSchema, 'params'),
  userController.deleteUser
);

module.exports = router;
