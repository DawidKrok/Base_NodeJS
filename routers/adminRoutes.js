const router = require('express').Router()
const services = require('../services/adminServices')
const tokenServices = require('../services/tokenServices')

//&&&&&&&&&&&&&| POST METHODS |&&&&&&&&&&&&&&
/** req.body:
 * @email : obvious
 * @password : also obvious */
router.post("/login", services.authenticateAdmin, services.login)

/** req.body:
 * @email : obvious
 * @password : also obvious */
router.post("/register", services.register, services.login)

/** Data is retrieved from user's cookies 
 * @Deletes Refresh Token from database and user's cookies */
router.post("/logout", tokenServices.deleteToken)

module.exports = router
