const Course = require('../models/Course')
const User = require('../models/User')

// @desc Get all courses
// @route GET /courses
// @access Private
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().lean()

    if (!courses?.length) {
      return res.status(404).json({ message: 'Aucun cours trouvé.' })
    }

    // 🧠 Enrichit chaque cours avec le nom d’utilisateur
    const coursesWithUser = await Promise.all(
      courses.map(async (course) => {
        const user = await User.findById(course.user).lean().exec()
        return {
          ...course,
          username: user?.username || 'Utilisateur inconnu',
        }
      })
    )

    res.json(coursesWithUser)
  } catch (err) {
    next(err)
  }
}

// @desc Create new course
// @route POST /courses
// @access Private
const createNewCourse = async (req, res, next) => {
  try {
    const { user, title, text, link } = req.body

    if (!user || !title || !text || !link) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' })
    }

    // Optionnel : vérification de doublon
    // const duplicate = await Course.findOne({ title }).lean().exec()
    // if (duplicate) {
    //   return res.status(409).json({ message: 'Titre de cours déjà utilisé.' })
    // }

    const course = await Course.create({ user, title, text, link })

    if (!course) {
      return res.status(400).json({ message: 'Données de cours invalides.' })
    }

    res.status(201).json({ message: `Cours '${title}' créé.` })
  } catch (err) {
    next(err)
  }
}

// @desc Update a course
// @route PATCH /courses/:id
// @access Private
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params
    const { user, title, text, completed } = req.body

    if (!user || !title || !text || typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Tous les champs sont requis.' })
    }

    const course = await Course.findById(id).exec()

    if (!course) {
      return res.status(404).json({ message: 'Cours introuvable.' })
    }

    // Optionnel : vérification de doublon
    // const duplicate = await Course.findOne({ title }).lean().exec()
    // if (duplicate && duplicate._id.toString() !== id) {
    //   return res.status(409).json({ message: 'Titre de cours déjà utilisé.' })
    // }

    course.user = user
    course.title = title
    course.text = text
    course.completed = completed

    const updatedCourse = await course.save()

    res.json({ message: `Cours '${updatedCourse.title}' mis à jour.` })
  } catch (err) {
    next(err)
  }
}

// @desc Delete a course
// @route DELETE /courses/:id
// @access Private
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params

    const course = await Course.findById(id).exec()

    if (!course) {
      return res.status(404).json({ message: 'Cours introuvable.' })
    }

    const result = await course.deleteOne()

    res.json({
      message: `Cours '${result.title}' avec l’ID ${result._id} supprimé.`,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllCourses,
  createNewCourse,
  updateCourse,
  deleteCourse,
}
