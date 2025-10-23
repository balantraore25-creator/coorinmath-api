const User = require('../models/User')
const Course = require('../models/Course')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé.' })
    }
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res, next) => {
  try {
    const { username, password, roles } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Nom d’utilisateur et mot de passe requis.' })
    }

    const duplicate = await User.findOne({ username })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec()

    if (duplicate) {
      return res.status(409).json({ message: 'Nom d’utilisateur déjà utilisé.' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject =
      !Array.isArray(roles) || !roles.length
        ? { username, password: hashedPwd }
        : { username, password: hashedPwd, roles }

    const user = await User.create(userObject)

    if (!user) {
      return res.status(400).json({ message: 'Données utilisateur invalides.' })
    }

    res.status(201).json({ message: `Nouvel utilisateur ${username} créé.` })
  } catch (err) {
    next(err)
  }
}

// @desc Update a user
// @route PATCH /users/:id
// @access Private
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { username, roles, active, password } = req.body

    if (!username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'Tous les champs sauf le mot de passe sont requis.' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' })
    }

    const duplicate = await User.findOne({ username })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec()

    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({ message: 'Nom d’utilisateur déjà utilisé.' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} mis à jour.` })
  } catch (err) {
    next(err)
  }
}

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID utilisateur requis.' })
    }

    const course = await Course.findOne({ user: id }).lean().exec()
    if (course) {
      return res.status(400).json({ message: 'L’utilisateur a des cours assignés.' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' })
    }

    const result = await user.deleteOne()
    res.json({
      message: `Utilisateur ${result.username} avec l’ID ${result._id} supprimé.`,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
}
