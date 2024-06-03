const express = require("express")
const router = express.Router()

const {user, loginUser, sendMessage} = require("../controllers/user")

router.post("/signup", user)
router.post("/login", loginUser)
router.post("/send", sendMessage)


module.exports = router