const Hotel = require("../models/registerHotel");
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
        Bucket: "viaa-bucket",
        Key: `${originalName}`, // Append a unique identifier to the original file name to avoid collisions
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
    const userId = req.user._id
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
    } = req.body;
    if (
      !hotelName ||
      !hotelEmail ||
      !contactDetails ||
      !address ||
      !link ||
      !logo ||
      !images ||
      !videos ||
      !map ||
      !description ||
      !confirmRegNumber ||
      !area ||
      !hotelStar ||
      !propertyPapers ||
      !aggrementPapers ||
      !electricityBill ||
      !cameras ||
      !wifi ||
      !ownerAdhaarCard ||
      !ownerAdhaarCardNo ||
      !ownerPanCard ||
      !ownerPanCardNo
    )
      return validateFields(res);
    const request = {
      ownerId: userId,
      hotelName: hotelName,
      hotelEmail: hotelEmail,    
      contactDetails: contactDetails,   
      address: address,   
      link: link,   
      logo: logo,   
      images: images,   
      videos: videos,   
      map: map,   
      description: description,   
      confirmRegNumber: confirmRegNumber,   
      area: area,   
      hotelStar: hotelStar,     
      propertyPapers: propertyPapers,   
      aggrementPapers: aggrementPapers,   
      electricityBill: electricityBill,   
      cameras: cameras,   
      wifi: wifi,
      ownerAdhaarCard: ownerAdhaarCard,
      ownerAdhaarCardNo: ownerAdhaarCardNo,
      ownerPanCard: ownerPanCard,
      ownerPanCardNo: ownerPanCardNo,
      status: status,
    };
    let hotel = await Hotel.create(request);    
    return res.status(200).send({ hotel, msg: "Successfully created" });
  } catch (error) {
    console.log("error");
    return res.status(500).send({ error: "Something broke" });
  }
};  