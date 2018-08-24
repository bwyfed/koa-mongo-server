// Load the module dependencies
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define a new 'MicroCodeSchema'
const MicroCodeSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: 'Microcode is required'
  },
  token: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})

// Create the 'MicroCode' out of the 'MicroCodeSchema'
mongoose.model('MicroCode', MicroCodeSchema, 'microcode')