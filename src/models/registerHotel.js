const {default :mongoose, Schema} = require("mongoose");

const registerHotelSchema = new Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  hotelName: {
    type: String,
    require: true,
  },
  hotelEmail: {
    type: String,
    require: true,
  },
  contactDetails: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  link: {
    type: String,
  },
  logo: {
    type: Object,
  },
  images: [
    {
      type: Object,
    },
  ],
  videos: [
    {
      type: Object,
    },
  ],
  map: {
    type: String,
  },
  description: {
    type: String,
  },
  confirmRegNumber: {
    type: String,
  },
  area: {
    type: String,
  },
  wifi: {
    type: Boolean,
    default: true,
  },
  hotelStar: {
    type: Number,
    enum: [2, 3, 4, 5,],
    default: 2,
  },
  propertyPapers : [{ type: Object }],
  aggrementPapers : [{ type: Object }],
  electricityBill : [{ type: Object }],
  cameras : {
    type : Boolean,
    default : true,
  },
  ownerPanCardNo : {
    type : String
  },
  ownerPanCard: {
    type: Object,
  },
  ownerAdhaarCardNo: {
    type: String,
  },
  ownerAdhaarCard: [{
    type: Object,
  }],
  HotelApproved : {
    type : String,
    enum : ["approved", "pending", "rejected"],
    default : "pending"
  },
  daysAvailiblity : {
    type : String,
    enum : ["Everyday", "Weekdays", "Weekends"],
    default : "Weekdays"
  },
  alldaysAvailable : {
    type : Boolean,
    default : false
  },
  from: String,
  to: String,
  slots: [
    {
      slot: String, 
      available: {
        type: Boolean,
        default: false,
      },
    },
  ],
  status: {
    type: Boolean,
    default: false,
  },
});

const Hotel = mongoose.model("hotel", registerHotelSchema);
module.exports = Hotel;
