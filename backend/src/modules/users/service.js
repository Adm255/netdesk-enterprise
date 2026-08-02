const bcrypt = require("bcrypt");

const {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser
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

const createNewUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await createUser({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashedPassword,
    phone: userData.phone || null,
    status: userData.status ?? true,
    roleId: Number(userData.roleId),
    departmentId: Number(userData.departmentId)
  });

  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser
};