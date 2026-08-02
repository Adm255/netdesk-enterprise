const bcrypt = require("bcrypt");

const {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser
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

const updateExistingUser = async (id, userData) => {
  const existingUser = await findUserById(Number(id));

  if (!existingUser) {
    throw new Error("User not found.");
  }

  if (userData.email && userData.email !== existingUser.email) {
    const emailOwner = await findUserByEmail(userData.email);

    if (emailOwner) {
      throw new Error("Email already exists.");
    }
  }

  const updateData = {};

  if (userData.firstName !== undefined) {
    updateData.firstName = userData.firstName;
  }

  if (userData.lastName !== undefined) {
    updateData.lastName = userData.lastName;
  }

  if (userData.email !== undefined) {
    updateData.email = userData.email;
  }

  if (userData.phone !== undefined) {
    updateData.phone = userData.phone;
  }

  if (userData.status !== undefined) {
    updateData.status = userData.status;
  }

  if (userData.roleId !== undefined) {
    updateData.roleId = Number(userData.roleId);
  }

  if (userData.departmentId !== undefined) {
    updateData.departmentId = Number(userData.departmentId);
  }

  if (userData.password) {
    updateData.password = await bcrypt.hash(userData.password, 10);
  }

  return await updateUser(id, updateData);
};

const deleteExistingUser = async (id) => {
  const existingUser = await findUserById(Number(id));

  if (!existingUser) {
    throw new Error("User not found.");
  }

  await deleteUser(id);

  return existingUser;
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  updateExistingUser,
  deleteExistingUser
};