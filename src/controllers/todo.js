const ToDo = require("../models/todo");

exports.createToDo = async (req, res) => {
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
    let todo = await ToDo.create(request);
    return res.status(200).send({ todo, msg: "Created Sucessfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
};

exports.getToDo = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    const result = {};

    if (endIndex < (await ToDo.countDocuments().exec())) {
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

    const totalCount = await ToDo.countDocuments().exec();

    const pagination =
      page && limit
        ? [page && { $skip: startIndex }, limit && { $limit: parseInt(limit) }]
        : [];

    let data = await ToDo.aggregate([
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

exports.updateToDo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const todo = await ToDo.findById(todoId);
    if (!todo) return res.status(400).send({ error: "Todo not found" });

    const { title, description, status } = req.body;

    if (title) {
      todo.title = title;
    }
    if (description) {
      todo.description = description;
    }
    if (status) {
      todo.status = status;
    }

    await todo.save();
    return res.status(200).send({ todo, msg: "Successfully Updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Somethoing broke" });
  }
};

exports.deleteToDo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const todo = await ToDo.findById(todoId);
    if (!todo) return res.status(400).send({ error: "Todo not found" });

    await ToDo.findByIdAndDelete(todoId);
    return res.status(200).send({ msg: "SuccessFully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
};
