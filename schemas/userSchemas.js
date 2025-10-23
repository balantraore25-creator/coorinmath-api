const Joi = require('joi')

// Pour POST /users
const createUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': 'Le nom d’utilisateur doit être une chaîne de caractères',
      'string.min': 'Le nom d’utilisateur doit contenir au moins 3 caractères',
      'any.required': 'Le nom d’utilisateur est requis',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Le mot de passe doit être une chaîne de caractères',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis',
    }),

  roles: Joi.array()
    .items(Joi.string())
    .default(['Apprenant']) // 👈 correspond au default du modèle Mongoose
    .messages({
      'array.base': 'Les rôles doivent être un tableau de chaînes',
    }),

  active: Joi.boolean()
    .default(true) // 👈 correspond au default du modèle Mongoose
    .messages({
      'boolean.base': 'Le champ "active" doit être un booléen',
    }),
})

// Pour PATCH /users/:id
const updateUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .messages({
      'string.base': 'Le nom d’utilisateur doit être une chaîne de caractères',
      'string.min': 'Le nom d’utilisateur doit contenir au moins 3 caractères',
    }),

  password: Joi.string()
    .min(6)
    .messages({
      'string.base': 'Le mot de passe doit être une chaîne de caractères',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    }),

  roles: Joi.array()
    .items(Joi.string())
    .messages({
      'array.base': 'Les rôles doivent être un tableau de chaînes',
    }),

  active: Joi.boolean()
    .messages({
      'boolean.base': 'Le champ "active" doit être un booléen',
    }),
}).min(1) // 👈 assure qu’au moins un champ est présent

// Pour valider l’ID MongoDB dans les params
const userIdParamSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      'string.length': 'L’ID doit contenir exactement 24 caractères',
      'string.hex': 'L’ID doit être au format hexadécimal',
      'any.required': 'L’ID est requis',
    }),
})

module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
}


/*const Joi = require('joi')

// Pour POST /users
const createUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  roles: Joi.array().items(Joi.string()).min(1).required()
})

// Pour PATCH /users/:id
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6),
  roles: Joi.array().items(Joi.string()).min(1).required(),
  active: Joi.boolean().required()
})

const userIdParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required() // format ObjectId
})

module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
}*/
