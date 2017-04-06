// =====================
// DEPENDENCIES
// =====================
const express = require('express')
const router = express.Router()
const async = require('async')

// =====================
// MODELS
// =====================
const Users = require('../models/users.js')
const Products = require('../models/products.js')

// =====================
// DATA
// =====================
const data = require('../data/wms_product_data.json')

// =====================
// ROUTES
// =====================

router.get('/', (req, res, next) => {
  const sample = new Users({
    name: 'admin',
    password: 's5aswefr2sT#7ech'
  })

  async.waterfall(
    [
      function (callback) {
        Users.find({ name: sample.name }, callback)
      }
    ],
    function (err, user) {
      if (err) return next(err)

      if (user.length === 0) {
        sample.save(function (err) {
          if (err) return next(err)

          Products.insertMany(data, {ordered: false}, (err, result) => {
            if (err) return next(err)
            res.status(200).json({
              success: true,
              totalProducts: data.length,
              totalProductsImported: result.length,
              message: 'Configuration executed successfully'
            })
          })
        })
      } else {
        res.status(403).json({ success: false, message: 'Setup already performed' })
      }
    }
  )
})

// =====================
// RETURN ROUTER
// =====================
module.exports = router
