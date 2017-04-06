// =====================
// DEPENDENCIES
// =====================
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dotenv = require('dotenv')

const users = require('./app/controllers/users')
const setup = require('./app/controllers/setup')
const verifytoken = require('./app/controllers/verifytoken')
const products = require('./app/controllers/products')

dotenv.load()

// =====================
// MONGODB
// =====================
mongoose.connect(process.env.MONGODB)

// =====================
// CONFIGURATION
// =====================
const app = express()
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))

// =====================
// LOG
// =====================
app.use(morgan('dev'))

// =====================
// ROUTES
// =====================
app.use('/api/' + process.env.VERSION + '/setup', setup)
app.use('/api/' + process.env.VERSION + '/users', users)
app.use('/api/' + process.env.VERSION, verifytoken)
app.use('/api/' + process.env.VERSION + '/products', products)

// =====================
// START SERVER
// =====================

const server = app.listen(3000, () => {
  const {address, port} = server.address()
  console.log(`API listening at http://${address}:${port}`)
})
