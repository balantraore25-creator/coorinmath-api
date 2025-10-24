const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const validateRequest = require('../middleware/validateRequest');
const verifyJWT = require('../middleware/verifyJWT');

const {
  createCourseSchema,
  updateCourseSchema,
  deleteCourseSchema
} = require('../schemas/courseSchemas');

// 🔐 Middleware global : protège toutes les routes
router.use(verifyJWT);

// 📚 Route principale : /courses
router.route('/')
  .get(courseController.getAllCourses)
  .post(validateRequest(createCourseSchema), courseController.createNewCourse)
  .patch(courseController.updateCourse) // Optionnel : valider req.body si besoin
  .delete(courseController.deleteCourse); // Optionnel : valider req.body.id

// 🛠️ Routes paramétrées : /courses/:id
router.patch(
  '/:id',
  validateRequest(updateCourseSchema, 'params'),
  courseController.updateCourse
);

router.delete(
  '/:id',
  validateRequest(deleteCourseSchema, 'params'),
  courseController.deleteCourse
);

module.exports = router;
