const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ["Apprenant"]
    },
    active: {
        type: Boolean,
        default: true
    },
     refreshToken: { type: String, default: null } // 🔑 session unique
})

module.exports = mongoose.model('User', userSchema)