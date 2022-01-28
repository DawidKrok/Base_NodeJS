const router = require('express').Router()
const tokenServices = require("../services/tokenServices")

//&&&&&&&&&&&&&| GET METHODS |&&&&&&&&&&&&&&
router.get("/", (req, res) => {
    res.render("index")
})


module.exports = router
