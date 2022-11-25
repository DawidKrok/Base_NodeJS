const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Admin = require('../db/schemes').Admin
const RefreshToken = require('../db/schemes').RefreshToken
const tokenServices = require("./tokenServices")

// &&&&&&&&&&&&&&&& | LOGIN AND REGISTRATION | &&&&&&&&&&&&&&&
// Checks if data passed is compatible with one of admins in database
authenticateAdmin = async (req, res, next) => {
    try {
        if (!req.body.email) return res.sendStatus(400)

        const admin = await Admin.findOne({ email: req.body.email }).lean()

        // Check if admin was found
        if (!admin) return res.status(404).send()

        // Check if password matches
        if (!await bcryptjs.compare(req.body.password, admin.password))
            return res.status(401).send()

        // admin for login
        req.admin = admin
        next()
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
}

login = async (req, res) => {
    try {
        // check if admin is already logged
        if(await tokenServices.checkRefreshToken(req.cookies.refreshToken))   
            return res.sendStatus(406)

        // Return token to store and use for further access
        const accessToken = tokenServices.generateAccessToken(req.admin)

        const refreshToken = jwt.sign(req.admin, process.env.REFRESH_TOKEN_SECRET)

        // save new Refresh Token
        const saveToken = new RefreshToken({ token: refreshToken })
        await saveToken.save()

        // Store Refresh Token in client's cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000  // 15 min
        })

        // Send Access Token to client
        res.status(202).json(accessToken)
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
}

// check data and add new admin to database with given email and password
register = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) return res.sendStatus(401)
        // Check if send data is valid
        if (!validateRegistration(req.body)) return res.sendStatus(403)

        //TODO: verify mail
        const admin = await Admin.findOne({ email: req.body.email })

        // If there's already admin with same mail registered
        if (admin) return res.sendStatus(404)

        // Hashing password
        const hashedPass = await bcryptjs.hash(req.body.password, 10)

        const newAdmin = new Admin({
            email: req.body.email,
            password: hashedPass,
        })
        await newAdmin.save()

        console.log(`Registered new admin: ${req.body.email}`)

        //admin for login
        req.admin = newAdmin.toJSON()
        next()
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
}

/** Checks if data for registration is valid
 * @data : data to validate */
validateRegistration = data => {
    // regex for email Test
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!re.test(data.email.toLowerCase())) return false

    if (data.password.length < 7) return false

    return true
}


// &&&&&&&&&&&&&&&& | EXPORTS | &&&&&&&&&&&&&&&

module.exports = {
    authenticateAdmin,
    login,
    register
}