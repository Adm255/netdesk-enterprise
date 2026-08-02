const {
  getAllUsers,
  getUserById,
  createNewUser
} = require("./service");

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await createNewUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser
};