// Load the module dependencies
const mongoose = require('mongoose')

// Define a new 'UserSchema'
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // Set a unique 'username' index
    unique: true,
    // Validate 'username' value existance
    required: 'Username is required',
    // Trim the 'username' field
    trim: true
  },
  password: {
    type: String,
    // Validate the 'password' value length
    validate: [
      function(password) {
        return password && password.length > 6;
      },
      'Password should be longer than 6'
    ]
  },
  mobilephone: String,
  phonePrefix: String,
  email: {
    type: String,
    // Validate the email format
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  residence: Array
})
