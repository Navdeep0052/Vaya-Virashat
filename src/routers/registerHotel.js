const express = require("express")
const router = express.Router()
const multer = require('multer');
const upload = multer();

const ctrl = require("../controllers/registerHotel")
const {verifyJwtToken, verifyOptionalJwtToken} = require("../middlewares/auth")

router.post("/register", verifyJwtToken, ctrl.registerHotel)
router.post("/upload", upload.array('files'), ctrl.uploadFiles)


module.exports = router