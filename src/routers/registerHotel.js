const express = require("express")
const router = express.Router()
const multer = require('multer');
const upload = multer();

const ctrl = require("../controllers/registerHotel")
const {verifyJwtToken, verifyOptionalJwtToken} = require("../middlewares/auth")

router.post("/register", verifyJwtToken, ctrl.registerHotel)
router.post("/upload", upload.array('files'), ctrl.uploadFiles)
router.get("/listing", verifyJwtToken, ctrl.getRegisterHotel)
router.get("/hotels/:hotelId", ctrl.getHotelDetails)
router.delete("/deleteHotel/:hotelId", verifyJwtToken, ctrl.deleteHotel)
router.put("/editHotel/:hotelId", verifyJwtToken, ctrl.editHotel)


module.exports = router