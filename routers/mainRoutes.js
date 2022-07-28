const router = require('express').Router()
const tokenServices = require("../services/tokenServices")

//&&&&&&&&&&&&&| GET METHODS |&&&&&&&&&&&&&&
router.get("/", (req, res) => {
    res.render("index")
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/admin", tokenServices.checkLogged, (req, res) => {
    res.render("admin")
})


module.exports = router
