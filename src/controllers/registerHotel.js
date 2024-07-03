const Hotel = require("../models/registerHotel");
const moment = require("moment");
const {
  validateFields,
  validateFound,
  validateId,
} = require("../validators/commonValidations");

const AWS = require("aws-sdk");
const { Console, count } = require("console");

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};
const S3 = new AWS.S3(awsConfig);

exports.uploadFiles = async function (req, res) {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const uploadResults = [];

    for (const file of files) {
      const mimeType = file.mimetype;
      const binaryData = file.buffer;
      const originalName = file.originalname.replace(/\s/g, ""); // Get the original file name and remove any spaces

      // Set S3 upload parameters
      const params = {
        Bucket: "flb-public",
        Key: `${originalName}`, 
        Body: binaryData,
        ContentType: mimeType,
      };

      const s3upload = await S3.upload(params).promise();
      uploadResults.push(s3upload);
    }

    res.status(200).json(uploadResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Upload failed: ${err.message}` });
  }
};

exports.registerHotel = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      hotelName,
      hotelEmail,
      contactDetails,
      address,
      link,
      logo,
      images,
      videos,
      map,
      description,
      confirmRegNumber,
      area,
      hotelStar,
      propertyPapers,
      aggrementPapers,
      electricityBill,
      cameras,
      wifi,
      ownerAdhaarCard,
      ownerAdhaarCardNo,
      ownerPanCard,
      ownerPanCardNo,
      status,
      daysAvailiblity,
      alldaysAvailable,
      from,
      to,
    } = req.body;

    // Function to generate slots
    const generateSlots = (from, to) => {
      const startTime = moment("08:00:00", "HH:mm:ss");
      const endTime = moment("23:00:00", "HH:mm:ss");
      const interval = 30; // 30 minutes interval
      const slots = [];

      const userFrom = moment(from, "HH:mm:ss");
      const userTo = moment(to, "HH:mm:ss");

      while (startTime.isBefore(endTime)) {
        const slotTime = startTime.format("HH:mm:ss");
        const isAvailable = startTime.isSameOrAfter(userFrom) && startTime.isBefore(userTo);
        slots.push({ slot: slotTime, available: isAvailable });
        startTime.add(interval, "minutes");
      }

      return slots;
    };

    let slots = [];
    if (from && to) {
      // Generate slots if from and to times are provided
      slots = generateSlots(from, to);
    }

    const request = {
      ownerId: userId,
      hotelName,
      hotelEmail,
      contactDetails,
      address,
      link,
      logo,
      images,
      videos,
      map,
      description,
      confirmRegNumber,
      area,
      hotelStar,
      propertyPapers,
      aggrementPapers,
      electricityBill,
      cameras,
      wifi,
      ownerAdhaarCard,
      ownerAdhaarCardNo,
      ownerPanCard,
      ownerPanCardNo,
      status,
      daysAvailiblity,
      alldaysAvailable,
      from,
      to,
      slots,
    };

    let hotel = await Hotel.create(request);
    return res.status(201).send({ hotel, message: "Hotel registration successful!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
};

exports.getRegisterHotel = async (req, res) => {
  try {
    const userId = req.user._id
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const hotel = await Hotel.find({ ownerId: userId }).skip((page - 1) * limit).limit(limit);
    return res.status(200).send({ hotel : hotel, message : "List Fetched Successfully"  });
  } catch (error) {
    console.log("error");
    return res.status(500).send({ error: "Something broke" });
  }
};

exports.getHotelDetails = async (req, res) => {
  try {
    const hotelId = req.params.hotelId
    const hotel = await Hotel.findById(hotelId);
    return res.status(200).send({ hotel : hotel, message : "List Fetched Successfully"  });
  } catch (error) {
    console.log("error");
    return res.status(500).send({ error: "Something broke" });
  }
};

exports.editHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const {
      hotelName,
      hotelEmail,
      contactDetails,
      address,  
      link,
      logo,
      images,
      videos,
      map,
      description,
      confirmRegNumber,
      area,
      hotelStar,
      propertyPapers,
      aggrementPapers,
      electricityBill,
      cameras,  
      wifi,     
      ownerAdhaarCard,
      ownerAdhaarCardNo,
      ownerPanCard,
      ownerPanCardNo,
      alldaysAvailable,
      daysAvailiblity,
      from,
      to
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).send({ error: "Hotel not found" });

    if (hotelName) hotel.hotelName = hotelName;
    if (hotelEmail) hotel.hotelEmail = hotelEmail;
    if (contactDetails) hotel.contactDetails = contactDetails;
    if (address) hotel.address = address;
    if (link) hotel.link = link;
    if (logo) hotel.logo = logo;
    if (images) hotel.images = images;
    if (videos) hotel.videos = videos;
    if (map) hotel.map = map;
    if (description) hotel.description = description;
    if (confirmRegNumber) hotel.confirmRegNumber = confirmRegNumber;
    if (area) hotel.area = area;
    if (hotelStar) hotel.hotelStar = hotelStar;
    if (propertyPapers) hotel.propertyPapers = propertyPapers;
    if (aggrementPapers) hotel.aggrementPapers = aggrementPapers;
    if (electricityBill) hotel.electricityBill = electricityBill;
    if (cameras) hotel.cameras = cameras;
    if (wifi) hotel.wifi = wifi;
    if (ownerAdhaarCard) hotel.ownerAdhaarCard = ownerAdhaarCard;
    if (ownerAdhaarCardNo) hotel.ownerAdhaarCardNo = ownerAdhaarCardNo;
    if (ownerPanCard) hotel.ownerPanCard = ownerPanCard;
    if (ownerPanCardNo) hotel.ownerPanCardNo = ownerPanCardNo;
    if (alldaysAvailable !== undefined) hotel.alldaysAvailable = alldaysAvailable;
    if (daysAvailiblity) hotel.daysAvailiblity = daysAvailiblity;

    const generateSlots = (from, to) => {
      const startTime = moment("08:00:00", "HH:mm:ss");
      const endTime = moment("22:00:00", "HH:mm:ss");
      const interval = 30; // 30 minutes interval
      const slots = [];

      const userFrom = moment(from, "HH:mm:ss");
      const userTo = moment(to, "HH:mm:ss");

      while (startTime.isBefore(endTime)) {
        const slotTime = startTime.format("HH:mm:ss");
        const isAvailable = startTime.isSameOrAfter(userFrom) && startTime.isBefore(userTo);
        slots.push({ slot: slotTime, available: isAvailable });
        startTime.add(interval, "minutes");
      }

      return slots;
    };

    if (from && to) {
      hotel.slots = generateSlots(from, to);
    } else if (from || to) {
      return res.status(400).send({ error: "Both 'from' and 'to' times must be provided to update slots" });
    }

    await hotel.save();
    return res.status(200).send({ hotel, message: "Hotel Details Updated Successfully" });
  } catch (error) {
    console.log(error); 
    return res.status(500).send({ error: "Something broke" });
  }
};


exports.deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return validateFound(res)
    await Hotel.findByIdAndDelete(hotelId);
    return res.status(200).send({ msg: "SuccessFully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
}