const {default :mongoose, Schema} = require("mongoose")

const todoSchema = new Schema({
    title : {
        type : String,
        requitred : true
    },
    description : {
        type : String,
        required : true,
    },
    status : {
        type : String, 
        enum : ["pending","resolved"],
        required : true
    }
},
{timestamps : true})

const ToDo = mongoose.model("todo", todoSchema)
module.exports = ToDo