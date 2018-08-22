// Load the module dependencies
const mongoose = require('mongoose')
const crypto = require('crypto')

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
        return password && password.length >= 6;
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
  residence: Array,
  salt: {
    type: String
  },
  provider: {
    type: String,
    // Validate 'provider' value existance
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    // Create a default 'created' value
    default: Date.now
  }
})

// Use a pre-save middleware to hash the password
UserSchema.pre('save', function (next) {
  console.log('pre-save,this.password', this.password)
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64')
    this.password = this.hashPassord(this.password)
  }
  next()
})

// Create an instance method for hashing a password
UserSchema.methods.hashPassord = function (password) {
  console.log('this.salt', this.salt)
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64')
}

// Create an instance method for authenticating user
UserSchema.methods.authenticate = (password) => {
  return this.password === this.hashPassord(password)
}

// Configure to 'UserSchema' to user getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
  getters: true
})

// Create the 'User' out of the 'UserSchema'
mongoose.model('User', UserSchema)