const express = require("express")
const {default : mongoose } = require("mongoose")
const app = express()
const fs = require("fs")

const port = 8000

 const databse = "mongodb+srv://apisp:YC0KQIOhLAmUBy0l@cluster0.oxrsqmy.mongodb.net/apisp?retryWrites=true&w=majority"


app.use(express.json())

mongoose.connect(databse 
).then(()=>{
    console.log("databse is connected");
}).catch(()=>{
    console.log("error from database");
})




fs.readdirSync("./routers").map((r)=>{
    app.use("/api",require(`./routers/${r}`))
})


app.listen(port,()=>{
    console.log(`app is running on ${port}`);
})