const express = require("express")
const router = express.Router()

const ctrl = require("../controllers/home")

router.get("/hotels", ctrl.getHotels)


module.exports = router