const {default :mongoose, Schema} = require("mongoose")

const userSchema = new Schema({
    name : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true,
    },
    phone : {
        type : String,
        require : true,
    },
    role : {
        type : String,
        enum : ["user", "owner", "admin"],
        default : "user"
    },
    regNumber : {
        type : String
    },
})

const User = mongoose.model("user",userSchema)
module.exports = User