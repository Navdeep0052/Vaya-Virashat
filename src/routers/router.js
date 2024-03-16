const express = require("express")
const router = express.Router()

const {createToDo, getToDo, updateToDo, deleteToDo} = require("../controllers/todo")
const {authentication,authorization} = require("../middlewares/auth")

router.post("/create/:userId",authentication, authorization, createToDo)
router.get("/get/:userId",authentication, authorization, getToDo)
router.put("/update/:todoId/:userId",authentication, authorization, updateToDo)
router.delete("/delete/:todoId/:userId",authentication, authorization, deleteToDo)



module.exports = router