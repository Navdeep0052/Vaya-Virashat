const SysLog = require("../models/sysLog");
const axios = require("axios");
const os = require('os');
const requestIp = require("request-ip");
const Recently = require("../models/recentlyViewed");

exports.sysLog = async (req, res, next) => {
  try {
    // getting api req for IP
    const { data: ipAddress } = await axios.get(
      "http://www.geoplugin.net/json.gp"
    );

    let buyerId = req.user?._id;
    const item = {
      location: {
        ip: ipAddress?.geoplugin_request || "",
        locality: ipAddress?.geoplugin_city || "",
        countryCode: ipAddress?.geoplugin_countryCode || "",
        countryName: ipAddress?.geoplugin_countryName || "",
        principalSubdivision: ipAddress?.geoplugin_regionName || "",
        longitude: 0,
        latitude: 0,
      },
      buyerId,
      method: req.method || "",
      url: req.protocol + '://' + req.get('host') + req.originalUrl || "",
      action_date: new Date(),
    };

    const sys = await new SysLog(item).save();

    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};


// Helper function to get local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1'; // fallback if no external IP is found
}

// Middleware to store recently viewed property
exports.recentlyViewed = async (req, res, next) => {
    try {
      // Fetch IP information
      const { data: ipAddress } = await axios.get("http://www.geoplugin.net/json.gp");
  
      // Extract the property code from the request query
      const propertyCode = req.query.propertyCode || "";
  
      // Get local IP address
      const localIp = getLocalIpAddress(); // Assuming getLocalIpAddress() is defined somewhere
  
      // Find property ID based on propertyCode
      const property = await Property.findOne({ propertyCode }); // Adjust based on your schema
  
      if (!property) {
        return res.status(404).send("Property not found");
      }
  
      const propertyId = property._id; // Assuming your property ID field is named _id
  
      // Extract buyer IP and location information
      const location = {
        publicIp: ipAddress?.geoplugin_request || "",
        localIp,
        locality: ipAddress?.geoplugin_city || "",
        countryCode: ipAddress?.geoplugin_countryCode || "",
        countryName: ipAddress?.geoplugin_countryName || "",
        principalSubdivision: ipAddress?.geoplugin_regionName || "",
        principalSubdivisionCode: ipAddress?.geoplugin_regionCode || "",
      };
  
      // Create a new recently viewed record
      const recentlyViewedRecord = new Recently({
        propertyCode: propertyId, // Store propertyId instead of propertyCode
        location,
      });
  
      // Save the record to the database
      await recentlyViewedRecord.save();
  
      // Proceed to the next middleware or route handler
      return next();
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
  };