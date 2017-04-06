// =====================
// DEPENDENCIES
// =====================
var bcrypt = require('bcrypt-nodejs')
var mongoose = require('mongoose')

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
}

// =====================
// SCHEMA
// =====================
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  password: String
}, schemaOptions)

userSchema.pre('save', function (next) {
  var user = this

  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

module.exports = mongoose.model('user', userSchema)
