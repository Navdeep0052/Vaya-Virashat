const express = require("express")
const router = express.Router()

const ctrl = require("../controllers/chat")
const {verifyJwtToken, verifyOptionalJwtToken} = require("../middlewares/auth")


router.get("/getMessage/:id/:hotelId", verifyJwtToken, ctrl.getMessages)
router.post("/sendMessage/:id/:hotelId", verifyJwtToken, ctrl.sendMessage)
router.get("/chats", verifyJwtToken, ctrl.chats);


module.exports = router