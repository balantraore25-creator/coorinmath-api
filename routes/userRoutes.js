const express = require('express')
const router = express.Router()
const userController = require('../controllers/usersController')
const validateRequest = require('../middleware/validateRequest')
const { createUserSchema, updateUserSchema, userIdParamSchema } = require('../schemas/userSchemas')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


router.route('/')
  .get(userController.getAllUsers)
  .post(validateRequest(createUserSchema), userController.createNewUser)

router.route('/:id')
  .patch(
    validateRequest(userIdParamSchema, 'params'),
    validateRequest(updateUserSchema),
    userController.updateUser
  )
  .delete(
    validateRequest(userIdParamSchema, 'params'),
    userController.deleteUser
  )

module.exports = router
