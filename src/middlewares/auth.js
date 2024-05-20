const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authentication = (req, res, next) => {
  try {
    let bearerHeader = req.headers.authorization;
    if(typeof bearerHeader == "undefined") return res.status(400).send({ status: false, message: "Token is missing" });
    
    let bearerToken = bearerHeader.split(' ')
    let token = bearerToken[1];
    jwt.verify(token, "To-Do", function (err,data) {
      if(err) {
        return res.status(400).send({ status: false, message: err.message })
      }else {
        req.decodedToken = data;
        next()
      }
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

exports.authorization = async (req, res, next) => {
  try {
    let loggedInUser = req.decodedToken.userId;
    let loginUser;
    
    if(req.params?.userId){
      let checkUserId = await User.findById(req.params.userId);
      if(!checkUserId) return res.status(404).send({ status: false, message: "User not found" });
      loginUser = checkUserId._id.toString();
    }

    if(!loginUser) return res.status(400).send({ status: false, message: "User-id is required" })

    if(loggedInUser !== loginUser) return res.status(403).send({ status: false, message: "Error!! authorization failed" });
    next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}


//const jwt = require("jsonwebtoken");

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "30d" });
  return token;
};

exports.verifyJwtToken = async (req, res, next) => {
  try {
    // bearer token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(200)
        .json({ status: 403, message: "Token is required !" });
    }
    jwt.verify(token, process.env.SECRET, (err, data) => {
      if (err) {
        return res
          .status(200)
          .json({ status: 401, message: "Token is expired !" });
      }
      req.user = data;
      next();
    });
  } catch (e) {
    throw new Error(e);
  }
};

exports.verifyOptionalJwtToken = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      // No token provided, proceed without authentication
      return next();
    }

    // Extract token from authorization header
    const token = authHeader.split(" ")[1];

    // Verify token if it exists
    jwt.verify(token, process.env.SECRET, (err, data) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // Token expired
          return res.status(401).json({ status: 401, message: "Token is expired !" });
         } //else {
        //   // Other token verification errors
        //   return res.status(401).json({ status: 401, message: "Token is invalid !" });
        // }
      }
      
      // Token is valid, attach user data to request
      req.user = data;
      next();
    });
  } catch (e) {
    // Catch and handle unexpected errors
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

