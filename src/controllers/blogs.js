const Blogs = require("../models/blogs");

exports.createblogs = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) return res.status(400).send({ error: "Title is required" });
    if (!description)
      return res.status(400).send({ error: "description is required" });
    if (!status) return res.status(400).send({ error: "status is required" });

    const request = {
      title: title,
      description: description,
      status: status,
    };
    let todo = await Blogs.create(request);
    return res.status(200).send({ todo, msg: "Created Sucessfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
};

exports.getblogs = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    const result = {};

    if (endIndex < (await Blogs.countDocuments().exec())) {
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
    const sortField = req.query.sort || "title";

    let sortOrder = {};

    if (order === "ascending") {
      sortOrder = { [sortField]: 1 };
    } else if (order === "descending") {
      sortOrder = { [sortField]: -1 };
    } else {
      sortOrder = { createdAt: 1 };
    }

    const totalCount = await Blogs.countDocuments().exec();

    const pagination =
      page && limit
        ? [page && { $skip: startIndex }, limit && { $limit: parseInt(limit) }]
        : [];

    let data = await Blogs.aggregate([
      { $sort: { ...sortOrder } },
      {
        $facet: {
          data: [...pagination],
        },
      },
    ]);

    res.json({
      resStatus: true,
      res: data[0]?.data,
      count: totalCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke!" });
  }
};

exports.updateblogs = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blogs.findById(blogId);
    if (!blog) return res.status(400).send({ error: "Blog not found" });

    const { title, description, status } = req.body;

    if (title) {
      blog.title = title;
    }
    if (description) {
      blog.description = description;
    }
    if (status) {
      blog.status = status;
    }

    await blog.save();
    return res.status(200).send({ todo, msg: "Successfully Updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Somethoing broke" });
  }
};

exports.deleteblogs = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blogs.findById(blogId);
    if (!blog) return res.status(400).send({ error: "Blog not found" });

    await Blogs.findByIdAndDelete(blogId);
    return res.status(200).send({ msg: "SuccessFully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
};
