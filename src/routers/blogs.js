const express = require("express")
const router = express.Router()

const {createblogs, getblogs, updateblogs, deleteblogs} = require("../controllers/blogs")
const {verifyJwtToken, verifyOptionalJwtToken} = require("../middlewares/auth")

router.post("/create", verifyJwtToken, createblogs)
router.get("/get", verifyJwtToken, getblogs)
router.put("/update/:blogId", verifyJwtToken, updateblogs)
router.delete("/delete/:blogId", verifyJwtToken, deleteblogs)



module.exports = router