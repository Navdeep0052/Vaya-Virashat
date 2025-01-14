const express = require("express")
const router = express.Router()
const multer = require('multer');
const upload = multer();

const ctrl = require("../controllers/registerHotel")
const {verifyJwtToken, verifyOptionalJwtToken} = require("../middlewares/auth")

//api for upload files,images and videos
router.post("/upload", upload.array('files'), ctrl.uploadFiles)


//api for hotels
router.post("/register", verifyJwtToken, ctrl.registerHotel)
router.get("/listing", ctrl.getRegisterHotel)
router.get("/hotels/:hotelId", ctrl.getHotelDetails)
router.delete("/deleteHotel/:hotelId", verifyJwtToken, ctrl.deleteHotel)
router.put("/editHotel/:hotelId", verifyJwtToken, ctrl.editHotel)


//api for get nearBy places to that hotel
router.get("/getNearByPlaces", ctrl.nearbyplace)


module.exports = router