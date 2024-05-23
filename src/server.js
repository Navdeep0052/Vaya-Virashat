const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 8000;

const database = "mongodb+srv://apisp:YC0KQIOhLAmUBy0l@cluster0.oxrsqmy.mongodb.net/apisp?retryWrites=true&w=majority";

app.use(express.json());
app.use(cors());

mongoose.connect(database)
    .then(() => {
        console.log("database is connected");
    })
    .catch(() => {
        console.log("error from database");
    });

// Ensure no token-related middleware is applied globally here

fs.readdirSync("./routers").map((r) => {
    app.use("/", require(`./routers/${r}`));
});

app.listen(port, () => {
    console.log(`app is running on ${port}`);
});
