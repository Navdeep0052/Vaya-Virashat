const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { app, server } = require("./socket.io/socket"); // Assuming socket.io/socket exports both app and server

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, './.env') });

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

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
