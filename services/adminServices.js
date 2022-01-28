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

        // Only if admin corresponds to subdomain they're logging into (or if they're AllMight and have access to everything) they may pass futher
        const subdomain = req.get("host").split(".")[0]
        if(admin.city_name != subdomain && !admin.all_might)
            return res.sendStatus(401)

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
        if (!req.body.email || !req.body.password || !req.body.city_name) return res.sendStatus(401)
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
            city_name: req.body.city_name,
            city_data: req.body.city_data || ""
        })
        await newAdmin.save()

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


// &&&&&&&&&&&&&&&& | DATA | &&&&&&&&&&&&&&&
/** @Sends : @city_data base on @city_name */
getCityData = async (req, res) => {
    try {
        if(!req.body.city_name)  return res.sendStatus(403)

        admin = await Admin.findOne({
            all_might: false,
            city_name: req.body.city_name
        }).exec()

        if (!admin)      return res.sendStatus(404)

        res.status(202).send({
            city_data: admin.city_data
        })
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
}

/** @Sends : @city_data and @city_name from all admins in database */
getAllCitiesData = async (req, res) => {
    try {
        admin = await Admin.find({all_might: false}, {_id: 0, city_name: 1, city_data: 1}).lean()

        res.status(202).send(admin)
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
}

/** @Sends : status 202 if city name is present in database and 404 if not */
checkCityName = async (req, res) => {
    try {
        if(!req.body.city_name)  return res.sendStatus(403)

        city = await Admin.findOne({
            city_name: req.body.city_name
        }).exec()

        if (city)
            return res.status(202).send({})

        res.sendStatus(404)
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
}

// &&&&&&&&&&&&&&&& | SUPER ADMIN | &&&&&&&&&&&&&&&

/** @Sends : data of all non AllMight admins from database  */
getAllAdminData = async (req, res) => {
    try {
        if(!req.admin.all_might)    return res.sendStatus(401)

        admins_data = await Admin.find({all_might: false}, {password: 0, all_might: 0}).lean()

        res.status(202).send(admins_data)
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
}

updateAdmin = async (req, res) => {
    try {
        if(!req.admin.all_might)    return res.sendStatus(401)

        if(!req.body.id)    return res.sendStatus(403)

        // try to find place with given id in database
        const admin = await Admin.findById(req.body.id)
        if(!admin)  return res.sendStatus(404)

        // if one of the given data is falsy, corresponding value won't change
        admin.email = req.body.email || admin.email
        admin.password = req.body.password ? await bcryptjs.hash(req.body.password, 10) : admin.password
        admin.city_name = req.body.city_name || admin.city_name
        admin.city_data = req.body.city_data || admin.city_data

        await admin.save()

        res.status(202).send({})
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
}

deleteAdmin = async (req, res) => {
    try {
        if(!req.admin.all_might)    return res.sendStatus(401)

        if(!req.body.id)  return res.sendStatus(403)

        Admin.deleteOne({_id: req.body.id}, err => {
            if(err) return res.sendStatus(403)
            
            res.sendStatus(202)
        })
    } catch(err) {
        res.sendStatus(500)
        console.log(err) 
    }
}


// &&&&&&&&&&&&&&&& | EXPORTS | &&&&&&&&&&&&&&&

module.exports = {
    authenticateAdmin,
    login,
    register,
    getCityData,
    getAllCitiesData,
    checkCityName,
    getAllAdminData,
    updateAdmin,
    deleteAdmin
}