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
    }
})

const User = mongoose.model("user",userSchema)
module.exports = User