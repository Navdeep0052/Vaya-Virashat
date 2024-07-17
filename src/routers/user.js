const express = require("express")
const router = express.Router()

const {user, loginUser, sendMessage, profile} = require("../controllers/user")
const {verifyJwtToken, verifyOptionalJwtToken} = require("../middlewares/auth")

router.post("/signup", user)
router.post("/login", loginUser)
router.post("/send", sendMessage)

//fetch profile
router.get("/profile", verifyJwtToken, profile)

module.exports = router