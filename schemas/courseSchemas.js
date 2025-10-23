const Joi = require('joi')

const createCourseSchema = Joi.object({
  user: Joi.string().length(24).hex().required(),
  title: Joi.string().min(3).required(),
  text: Joi.string().min(10).required(),
  link: Joi.string().uri().required()

})

const updateCourseSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
  //user: Joi.string().length(24).hex().required(),
  //title: Joi.string().min(3).required(),
  title: Joi.string().min(1),
  text: Joi.string().min(10),
  completed: Joi.boolean(),
  assignedTo: Joi.string().pattern(/^[a-f\d]{24}$/), // MongoDB ObjectId
   // link: Joi.string().uri().required()
})

const deleteCourseSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
})

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  deleteCourseSchema
}



