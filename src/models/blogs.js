const {default :mongoose, Schema} = require("mongoose")

const blogSchema = new Schema({
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

const Blogs = mongoose.model("blog", blogSchema)
module.exports = Blogs