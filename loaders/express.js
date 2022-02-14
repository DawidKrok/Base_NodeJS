require('./mongoose')
require('dotenv').config()
const express = require('express')
const rateLimit = require('express-rate-limit')
const xss = require('xss')
const hbs = require("hbs")
const bp = require('body-parser')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 5000
const app = express()

// limits number of request that server will handle from one IP address (DoS protection)
const limit = rateLimit({
    max: 150, // max requests
    windowMs: 10 * 60 * 1000, // 10 minutes
    message: 'Too many requests' // message to send
});
app.use(limit);

// limits body payload to 25kb (DoS protection)
app.use(express.json({limit: '25kb'}))


// Data Sanitization against XSS
app.use(xss())

// Set partials directory and use hbs to send html pages to client
hbs.registerPartials("views/partials")
app.set("view engine", "hbs")

// Allows to parse whole json trough URL. Without it app can't read request body.
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// Middleware for reading cookies from request
app.use(cookieParser())

// To make folder "public" available for client (for frontend)
app.use(express.static("public"))

app.listen(port)

module.exports = app