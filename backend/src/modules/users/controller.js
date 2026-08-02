const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateExistingUser,
  deleteExistingUser
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

const updateUser = async (req, res) => {
  try {
    const user = await updateExistingUser(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user
    });
  } catch (error) {
    const statusCode =
      error.message === "User not found." ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await deleteExistingUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      user
    });
  } catch (error) {
    const statusCode =
      error.message === "User not found." ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};