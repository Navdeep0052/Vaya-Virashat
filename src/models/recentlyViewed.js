const { default: mongoose, Schema } = require("mongoose");

const recentlyViewSchema = new Schema({
  propertyCode: {
    type: String,
  },
  location: {
    publicIp: { type: String },
    localIp: { type: String },
    countryCode: { type: String },
    countryName: { type: String },
    principalSubdivision: { type: String },
    principalSubdivisionCode: { type: String },
  },
});

const Recently = mongoose.model("recentlyView", recentlyViewSchema);

module.exports = Recently;
