const express = require("express")
const router = express.Router()

const {user, loginUser} = require("../controllers/user")

router.post("/create/user", user)
router.post("/login/user", loginUser)




module.exports = router