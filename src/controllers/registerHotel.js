const Hotel = require("../models/registerHotel");
const moment = require("moment");
const axios = require("axios");
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
      locality,
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
      state,
      city,
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
      locality,
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
      state,
      city
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


// exports.nearbyplace = async (req, res) => {
//   try {
//     const locality = req.query.locality;
//     const city = req.query.city;
//     const state = req.query.state;
//     const apiKey = 'AIzaSyC19RU976nEhgdaxTWpH3NPeuPuNJ05xAI'; // Replace with your Google API Key

//     if (!locality || !city || !state) {
//       return res.status(400).send({ status: 400, message: "locality, city, and state are required" });
//     }

//     const location = `${locality}, ${city}, ${state}`;
//     const touristAttractionsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+${encodeURIComponent(location)}&type=tourist_attraction&key=${apiKey}`;
//     const shoppingMallsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=shopping+malls+in+${encodeURIComponent(location)}&type=shopping_mall&key=${apiKey}`;

//     const [touristAttractionsResponse, shoppingMallsResponse] = await Promise.all([
//       axios.get(touristAttractionsUrl),
//       axios.get(shoppingMallsUrl)
//     ]);

//     if (touristAttractionsResponse.data.status !== 'OK') {
//       return res.status(500).send({ status: 500, message: touristAttractionsResponse.data.error_message || 'Failed to fetch nearby tourist attractions' });
//     }

//     if (shoppingMallsResponse.data.status !== 'OK') {
//       return res.status(500).send({ status: 500, message: shoppingMallsResponse.data.error_message || 'Failed to fetch nearby shopping malls' });
//     }

//     const touristAttractions = touristAttractionsResponse.data.results;
//     const shoppingMalls = shoppingMallsResponse.data.results;

//     const origins = [`${locality}, ${city}, ${state}`];

//     // Fetch distances for tourist attractions
//     const touristAttractionsDestinations = touristAttractions.map(place => place.formatted_address).join('|');
//     const touristAttractionsDistanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(touristAttractionsDestinations)}&key=${apiKey}`;
//     const touristAttractionsDistanceResponse = await axios.get(touristAttractionsDistanceUrl);

//     if (touristAttractionsDistanceResponse.data.status !== 'OK') {
//       return res.status(500).send({ status: 500, message: touristAttractionsDistanceResponse.data.error_message || 'Failed to fetch distances for tourist attractions' });
//     }

//     const touristAttractionsDistances = touristAttractionsDistanceResponse.data.rows[0].elements;

//     const highlights = touristAttractions.map((place, index) => {
//       return {
//         name: place.name,
//         address: place.formatted_address,
//         mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
//         distance: touristAttractionsDistances[index].distance.text
//       };
//     });

//     // Fetch distances for shopping malls
//     const shoppingMallsDestinations = shoppingMalls.map(place => place.formatted_address).join('|');
//     const shoppingMallsDistanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(shoppingMallsDestinations)}&key=${apiKey}`;
//     const shoppingMallsDistanceResponse = await axios.get(shoppingMallsDistanceUrl);

//     if (shoppingMallsDistanceResponse.data.status !== 'OK') {
//       return res.status(500).send({ status: 500, message: shoppingMallsDistanceResponse.data.error_message || 'Failed to fetch distances for shopping malls' });
//     }

//     const shoppingMallsDistances = shoppingMallsDistanceResponse.data.rows[0].elements;

//     const shoppingMallsList = shoppingMalls.map((place, index) => {
//       return {
//         name: place.name,
//         address: place.formatted_address,
//         mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
//         distance: shoppingMallsDistances[index].distance.text
//       };
//     });

//     // Get coordinates of the searched location
//     const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
//     const geocodeResponse = await axios.get(geocodeUrl);

//     if (geocodeResponse.data.status !== 'OK') {
//       return res.status(500).send({ status: 500, message: geocodeResponse.data.error_message || 'Failed to fetch location coordinates' });
//     }

//     const coordinates = geocodeResponse.data.results[0].geometry.location;
//     const mapLocationUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;

//     res.status(200).send({
//       status: 200,
//       searchedLocation: {
//         locality,
//         city,
//         state,
//         mapLocationUrl
//       },
//       highlights,
//       shoppingMalls: shoppingMallsList
//     });
//   } catch (err) {
//     return res.status(500).send({ status: 500, message: err.message });
//   }
// };

exports.nearbyplace = async (req, res) => {
  try {
    const locality = req.query.locality;
    const city = req.query.city;
    const state = req.query.state;
    const apiKey = 'AIzaSyC19RU976nEhgdaxTWpH3NPeuPuNJ05xAI'; // Replace with your Google API Key

    if (!locality || !city || !state) {
      return res.status(400).send({ status: 400, message: "locality, city, and state are required" });
    }

    const location = `${locality}, ${city}, ${state}`;

    // Define URLs for different types of places
    const placeTypes = [
      { type: 'tourist_attractions', query: 'tourist attractions' },
      { type: 'shopping_malls', query: 'shopping malls' },
      { type: 'restaurants', query: 'restaurants'},
      { type: 'schools', query: 'schools'},
      { type: 'hospitals', query: 'hospitals'},
      { type: 'airports', query: 'international terminal airport'},
      { type: 'upcoming_Projects', query: 'government projects'}
    ];

    // Fetch data for each place type
    const promises = placeTypes.map(async ({ type, query, icon }) => {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}+in+${encodeURIComponent(location)}&key=${apiKey}`;
      const response = await axios.get(url);

      if (response.data.status !== 'OK') {
        throw new Error(`Failed to fetch nearby ${type}: ${response.data.error_message || 'Unknown error'}`);
      }

      const results = response.data.results;

      // Fetch distances
      const destinations = results.map(place => place.formatted_address).join('|');
      const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(location)}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;
      const distanceResponse = await axios.get(distanceUrl);

      if (distanceResponse.data.status !== 'OK') {
        throw new Error(`Failed to fetch distances for ${type}: ${distanceResponse.data.error_message || 'Unknown error'}`);
      }

      const distances = distanceResponse.data.rows[0].elements;

      // Prepare formatted places array
      const places = results.map((place, index) => ({
        name: place.name,
        address: place.formatted_address,
        mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        distance: distances[index].distance.text,
        icon
      }));

      return {
        type,
        places
      };
    });

    // Fetch coordinates for the searched location
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    const geocodeResponse = await axios.get(geocodeUrl);

    if (geocodeResponse.data.status !== 'OK') {
      throw new Error(`Failed to fetch location coordinates: ${geocodeResponse.data.error_message || 'Unknown error'}`);
    }

    const coordinates = geocodeResponse.data.results[0].geometry.location;
    const mapLocationUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;

    // Execute all promises concurrently
    const results = await Promise.all(promises);

    // Prepare final response
    const finalResponse = {
      status: 200,
      searchedLocation: {
        locality,
        city,
        state,
        mapLocationUrl
      },
      highlights: results.find(result => result.type === 'tourist_attractions').places,
      shoppingMalls: results.find(result => result.type === 'shopping_malls').places,
      restaurants: results.find(result => result.type === 'restaurants').places,
      schools: results.find(result => result.type === 'schools').places,
      hospitals: results.find(result => result.type === 'hospitals').places,
      airports: results.find(result => result.type === 'airports').places,
      UpcomingProjects: results.find(result => result.type === 'upcoming_Projects').places
    };

    res.status(200).send(finalResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error : "Something went wrong" });
  }
};