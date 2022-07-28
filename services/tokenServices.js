const RefreshToken = require('../db/schemes').RefreshToken
const jwt = require("jsonwebtoken")

// &&&&&&&&&&&&&&&& | TOKENS HANDLING | &&&&&&&&&&&&&&&
generateAccessToken = (admin) => {
    // set expiration date and admin object
    return jwt.sign({
        exp: Math.floor(Date.now()/1000) + 600, // 10 min expiration period
        data: admin}, 
        process.env.ACCESS_TOKEN_SECRET)
}

/** Checks if Access Token is @valid */
authenticateToken = (req, res, next) => {
    const token =  req.headers["authorization"] 

    if(token == null) return res.status(401).send()
    // if TOKEN will be good it will go to next middleware
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, admin) => {
        if(err) {
            console.log("Refreshing token due to: " + err.name);
            // if Access Token expires refresh it and return a new one to user
            return refreshAccessToken(req, res)
        }
        // retrieved admin for later use in next middleware
        req.admin = admin.data
        next() 
    })
}

/** Sends new Access Token when old one expires */
refreshAccessToken = async (req, res) => {
    try {
        usersRefreshToken = req.cookies.refreshToken

        // Check if Refresh Token was send and saved in database
        if(! await checkRefreshToken(usersRefreshToken))
            return res.sendStatus(401)

        // Check if Refresh Token is valid
        jwt.verify(usersRefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, admin) => {
            if(err)     return res.status(403).send()

            // return new Access Token
            res.status(217).json(generateAccessToken(admin))
        })
    } catch(err) {
        res.status(500).send()
        console.log(err)
    }
}

/** Checks if Refresh Token is @valid . Used to determine if user is logged or not (probably should change names of these functions) */
checkRefreshToken = async refreshToken => {
    try {
        if(!refreshToken)  return false

        // Check if Refresh Token exists in database
        if(!await RefreshToken.exists({token: refreshToken}))
            return false

        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

/** Handles checking if user is @logged and redirects them if they're not (probably should change names of these functions)*/
checkLogged = async (req, res, next) => {
    if(! await checkRefreshToken(req.cookies.refreshToken))
        return res.redirect(307, "/login")

    next()
}

/** @Deletes user's Refresh token from database and their cookies */
deleteToken = async (req, res) => {
    try {
        // Delete Refresh Token from database
        RefreshToken.deleteOne({token: req.cookies.refreshToken}, err => {
            if(err) return res.sendStatus(403)
        })
       
        // Deletes user's Refresh Token cookie
        res.cookie("refreshToken", "", {
            httpOnly: true,
            maxAge: -1
        })

        res.sendStatus(202)
    } catch(err) {
        res.status(500).send()
        console.log(err)
    }
}

// &&&&&&&&&&&&&&&& | EXPORTS | &&&&&&&&&&&&&&&
module.exports = {
    generateAccessToken,
    authenticateToken,
    checkRefreshToken,
    checkLogged,
    deleteToken
}