require('./mongoose')

const express = require('express')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const helmet = require("helmet")
const mongoSanitize = require('express-mongo-sanitize')
const hbs = require("hbs")
const bp = require('body-parser')
const cookieParser = require('cookie-parser')


const port = process.env.PORT || 5000
const app = express()


/** &&&&&&&&&&&&&&& | SECURITY | &&&&&&&&&&&&&&& */
// limits number of request that server will handle from one IP address (DoS protection)
const limit = rateLimit({
    max: 150, // max requests
    windowMs: 10 * 60 * 1000, // 10 minutes
    message: 'Too many requests' // message to send
});
app.use(limit);

// because most hosting services have proxy/load balancer the IP of request will be IP of load balancer/reverse proxy.
// in this case the rateLimit will be applied globally instead of on each IP address separately.
app.set('trust proxy', 1) 
// checking this endpoint allows to find out how many proxies are between user and the server. This number is used in 'trust proxy' above
app.get('/ip', (request, response) => response.send(request.ip))

// limits body payload to 25kb (DoS protection)
app.use(express.json({limit: '25kb'}))

// Data Sanitization against XSS
app.use(xss())
// Sets various HTTP headers giving protection over some xss attacks
app.use(helmet())

// Searches req.body, req.query or req.params for $ and . signs and replaces/removes them
app.use(mongoSanitize({
    replaceWith: '_',   // instead of removing $ and . signs they will be replaced with _ sign
}))


/** &&&&&&&&&&&&&&& | AVAIlABILITY | &&&&&&&&&&&&&&&  */
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