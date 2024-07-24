const { default: mongoose, Schema } = require("mongoose");

// const slotSchema = new Schema({
//   slot: {
//     type: String,
//     required: true
//   },
//   available: {
//     type: Boolean,
//     default: true
//   }
// });

const SavedProperties = new Schema({
  shortList: {
    type: Boolean,
    default: false,
  },
//   visitRequest: {
//     type: Boolean,
//     default: false,
//   },
  accepted: {
    type: Boolean,
    default: false,
  },
  shortListBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
  },
//   selectDate : {
//     type : Date,
//   },
//   slot: slotSchema,
},
{
  timestamps: true}
);

const ShortList = mongoose.model("shortList", SavedProperties);
module.exports = ShortList;
