const {
  findAllUsers,
  findUserById
} = require("./repository");

const getAllUsers = async () => {
  return await findAllUsers();
};

const getUserById = async (id) => {
  const user = await findUserById(Number(id));

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

module.exports = {
  getAllUsers,
  getUserById
};