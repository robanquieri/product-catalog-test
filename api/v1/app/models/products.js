// =====================
// DEPENDENCIES
// =====================
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const options = {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
}

// =====================
// SCHEMA
// =====================
const ProductSchema = new mongoose.Schema({
  sku: { type: String, required: true, lowercase: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  region: { type: String, required: true },
  stock: [{
    size: { type: String, required: true, lowercase: true },
    warehouse: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  brand: { type: String, required: true },
  categories: { type: Array, required: true, lowercase: true },
  product_image_url: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z0-9]{2,6}(?:\/[^/#?]+)+\.(?:jpg|jpeg|png|gif)$/gi.test(v)
      },
      message: '{VALUE} is not a valid url or this image type is not permited!'
    },
    required: [true, 'Product image url required']
  },
  special_price: Number
}, options)

ProductSchema.plugin(mongoosePaginate)

// =====================
// RETURN MODEL
// =====================
module.exports = mongoose.model('Products', ProductSchema)
