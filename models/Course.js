const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const courseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true,
      match: /^https?:\/\/.+/ // valide que c’est bien une URL
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

courseSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500
})

module.exports = mongoose.model('Course', courseSchema)
