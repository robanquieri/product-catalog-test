// =====================
// DEPENDENCIES
// =====================
const express = require('express')
const router = express.Router()
let Ajv = require('ajv')
let ajv = Ajv({ allErrors: true, removeAdditional: 'all' })
let productSchema = require('../models/new-product.json')
ajv.addSchema(productSchema, 'new-product')

// =====================
// MODELS
// =====================
const Products = require('../models/products.js')

// =====================
// LANGUAGES
// =====================
const languages = require('../languages/products.js')

// =====================
// VALIDATE
// =====================
/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse (schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    status: 'failed',
    errors: errors
  }
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
let validateSchema = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.body)
    if (!valid) {
      return res.send(errorResponse(ajv.errors))
    }
    next()
  }
}

// =====================
// ROUTES
// =====================
/**
 * Add new product
 * @returns {Product ID}
 */
router.post('/', validateSchema('new-product'), (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']
  req.body.product_image_url = (req.body.product_image_url.includes('http://')) ? req.body.product_image_url : 'http://' + req.body.product_image_url

  Products.create(req.body, (err, result) => {
    if (err) {
      let error

      for (var i in err.errors) {
        error = err.errors[i].message
      }

      return res.status(403).json({
        success: false,
        message: error
      })
    } else {
      res.status(200).json({
        success: true,
        message: LANGUAGE.NEW[2],
        productid: result._id
      })
    }
  })
})
/**
 * Import batch products
 * @returns {Results}
 */
router.post('/import', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']
  let data = req.body

  Products.insertMany(data, {ordered: false}, (err, result) => {
    if (err) return next(err)
    res.status(200).json({
      totalProducts: data.length,
      totalProductsImported: result.length,
      totalProductsWithError: data.length - result.length,
    })
  })
})
/**
 * Get all products
 * @property {numeric} req.query.page - Current page.
 * @property {numeric} req.query.limit - Total pages.
 * @returns {Products}
 */
router.get('/', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']
  const query = {}
  const options = {
    sort: { createdAt: -1 },
    lean: true,
    page: (req.query.page) ? Number(req.query.page) : 1,
    limit: (req.query.limit) ? Number(req.query.limit) : 5
  }

  Products.paginate(query, options).then((result) => {
    if (result.total > 0) {
      result.success = true
      result.message = LANGUAGE.GET_ALL_PRODUCTS[1]
      res.status(200).json(result)
    } else {
      res.status(404).json({ success: false, message: LANGUAGE.GET_ALL_PRODUCTS[2] })
    }
  })
})
/**
 * Get product
 * @returns {Product}
 */
router.get('/:id', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']

  Products.find({ _id: req.params.id }, (err, result) => {
    if (err) return next(err)

    if (result.length > 0) {
      const json = {}
      json.docs = result
      json.success = true
      json.message = LANGUAGE.GET_PRODUCT[2]
      res.status(200).json(json)
    } else {
      res.status(403).json({ success: false, message: LANGUAGE.GET_PRODUCT[1] })
    }
  })
})
/**
 * Get product stock by sku and size
 * @returns {Product stock}
 */
router.get('/stock/:sku/:size', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']
  const SKU = req.params.sku.toLowerCase();
  const SIZE = req.params.size.toLowerCase()

  Products.find({ 'sku': SKU, 'stock.size': SIZE }, (err, result) => {
    if (err) return next(err)
    let docs = {}

    for (var index in result[0].stock) {
      if (result[0].stock[index].size === SIZE) {
        docs.quantity = result[0].stock[index].quantity
        docs.warehouse = result[0].stock[index].warehouse
      }
    }

    if (result.length > 0) {
      const json = {}
      json.docs = docs
      json.success = true
      json.message = LANGUAGE.GET_PRODUCT_SKU_SIZE[1]
      res.status(200).json(json)
    } else {
      res.status(403).json({ success: false, message: LANGUAGE.GET_PRODUCT_SKU_SIZE[2] })
    }
  })
})
/**
 * Get product by sku or category
 * @returns {Products}
 */
router.get('/cms/:param', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']

  Products.find({$or: [{'sku': req.params.param}, {'categories': req.params.param}]}, (err, result) => {
    if (err) return next(err)

    if (result.length > 0) {
      const json = {}
      json.docs = result
      json.success = true
      json.message = LANGUAGE.GET_PRODUCT_SKU_OR_CATEGORY[1]
      res.status(200).json(json)
    } else {
      res.status(403).json({ success: false, message: LANGUAGE.GET_PRODUCT_SKU_OR_CATEGORY[2] })
    }
  }).select('content region')
})
/**
 * Update product
 * @property {string} req.params.id - The id of product.
 * @returns {Product}
 */
router.put('/:id', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']
  Products.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) return next(err)

    res.status(200).json({ success: true, message: LANGUAGE.UPDATE_PRODUCT[2] })
  })
})
/**
 * Delete product
 * @property {string} req.params.id - The id of product.
 */
router.delete('/:id', (req, res, next) => {
  const LANGUAGE = (req.headers['content-language']) ? languages[req.headers['content-language']] : languages['en']
  Products.findByIdAndRemove(req.params.id, (err, product) => {
    if (err) {
      res.status(403).json({ success: false, message: LANGUAGE.DELETE_PRODUCT[2] })
    } else {
      res.status(200).json({ success: true, message: LANGUAGE.DELETE_PRODUCT[1] })
    }
  })
})

// =====================
// RETURN ROUTER
// =====================
module.exports = router
