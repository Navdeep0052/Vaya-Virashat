const ShortList = require("../models/shortList");
const {
  validateFields,
  validateFound,
  validateId,
} = require("../validators/commonValidations");

exports.shortList = async (req, res) => {
  try {
    let userId = req.user._id;
    let hotelId = req.params.hotelId;
    if (!hotelId) return validateFound(res);
    let data = await ShortList.findOne({ shortListBy: userId, hotelId: hotelId });
    if (data) {
      await ShortList.findByIdAndDelete(data._id);
      return res.status(200).send({message: "Remove from shortlisted" });
    }else{
      const request = {
        shortList: true,
        shortListBy: userId,
        hotelId: hotelId,
      };
      let shortList = await ShortList.create(request);
      return res.status(200).send({ shortList, message: "Added to shortlisted" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
};
