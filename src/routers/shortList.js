const express = require("express")
const router = express.Router()

const ctrl = require("../controllers/shortList")
const {verifyJwtToken, verifyOptionalJwtToken} = require("../middlewares/auth")

router.post("/shortList/:hotelId", verifyJwtToken, ctrl.shortList)

module.exports = router