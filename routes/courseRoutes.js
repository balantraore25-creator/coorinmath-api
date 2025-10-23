const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')
const validateRequest = require('../middleware/validateRequest')
const { createCourseSchema, updateCourseSchema } = require('../schemas/courseSchemas')
const { deleteCourseSchema } = require('../schemas/courseSchemas')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


router.route('/')
  .get(courseController.getAllCourses)
  .post(validateRequest(createCourseSchema), courseController.createNewCourse)
  //.patch(validateRequest(updateCourseSchema), courseController.updateCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse) // tu peux aussi valider req.body.id ici


router.patch('/:id', validateRequest(updateCourseSchema, 'params'), courseController.updateCourse)

router.delete('/:id', validateRequest(deleteCourseSchema, 'params'), courseController.deleteCourse)


module.exports = router
