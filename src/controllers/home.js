const Hotel = require("../models/registerHotel");

exports.getHotels = async (req, res) => {
    try{
        let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    const result = {};

    if (endIndex < (await Hotel.countDocuments().exec())) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    const order = req.query.order || "";
    const sort = req.query.sort || "";

    let sortOrder = {};
    if (order === "ascending") {
      sortOrder = { [sort]: 1 };
    } else if (order === "descending") {
      sortOrder = { [sort]: -1 };
    } else {
      sortOrder = { createdAt: -1 };
    }

    const search = req.query.search || "";

    let searchQuery = search
      ? {
          $or: [
            {
              hotelName: { $regex: new RegExp(search), $options: "si" },
            },
            {
              hotelEmail: { $regex: new RegExp(`^${search}`), $options: "si" },
            },
          ],
        }
      : {};

    const hotels = await Hotel.find(searchQuery).sort(sortOrder).skip(startIndex).limit(limit);

    const count = await Hotel.countDocuments();

    return res.status(200).send({ hotels : hotels, totalCounts : count, message : "List Fetched Successfully"  });
        
    }catch(error){
        console.log(error);
        return res.status(500).send({ error: "Something broke" });
    }
}