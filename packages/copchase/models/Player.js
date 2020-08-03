const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  name: String,
  password: String
})

module.exports = mongoose.model('Player', playerSchema)