// =====================
// DEPENDENCIES
// =====================
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.load()

// =====================
// CONFIGURATION
// =====================
const app = express()
app.set('superSecret', process.env.TOKEN_SECRET)

// =====================
// ROUTES
// =====================

router.use((req, res, next) => {
  const tokenProvided = req.body.token || req.query.token || req.headers['x-access-token']

  if (tokenProvided) {
    jwt.verify(tokenProvided, app.get('superSecret'), {ignoreExpiration: false}, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
})

// =====================
// RETURN ROUTER
// =====================
module.exports = router
