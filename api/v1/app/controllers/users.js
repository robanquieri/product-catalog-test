// =====================
// DEPENDENCIES
// =====================
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const async = require('async')

dotenv.load()

// =====================
// CONFIGURATION
// =====================
const app = express()
app.set('superSecret', process.env.TOKEN_SECRET)

// =====================
// MODELS
// =====================
const Users = require('../models/users.js')

// =====================
// LANGUAGES
// =====================
const languages = require('../languages/users.js')

// =====================
// ROUTES
// =====================
/**
 * Authentication
 * @returns {Token}
 */
router.post('/login', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']

  async.waterfall(
    [
      function (callback) {
        Users.find({ username: req.body.name }, callback)
      }
    ],
    function (err, user) {
      if (err) return next(err)

      if (user.length > 0) {
        bcrypt.compare(req.body.password, user[0].password, (err, isMatch) => {
          if (err) return next(err)

          if (isMatch) {
            const token = jwt.sign(user[0], app.get('superSecret'), {
              expiresIn: '7d'
            })

            res.status(200).json({
              success: true,
              message: LANGUAGE.AUTH[3],
              token: token
            })
          } else {
            res.status(401).json({ success: false, message: LANGUAGE.AUTH[2] })
          }
        })
      } else {
        res.status(403).json({ success: false, message: LANGUAGE.AUTH[1] })
      }
    }
  )
})

// =====================
// RETURN ROUTER
// =====================
module.exports = router
