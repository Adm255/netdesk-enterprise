const bcrypt = require("bcrypt");

const {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} = require("./repository");

const {
  createUserSchema,
  updateUserSchema,
} = require("../../validators/userValidator");

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
  // Validate user data before saving
  const validatedData = createUserSchema.parse(userData);

  const existingUser = await findUserByEmail(
    validatedData.email
  );

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    validatedData.password,
    10
  );

  const user = await createUser({
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    email: validatedData.email,
    password: hashedPassword,
    phone: validatedData.phone || null,
    status: validatedData.status ?? true,
    roleId: Number(validatedData.roleId),
    departmentId: Number(validatedData.departmentId),
  });

  return user;
};

const updateExistingUser = async (id, userData) => {
  const existingUser = await findUserById(Number(id));

  if (!existingUser) {
    throw new Error("User not found.");
  }

  // Validate update data before saving
  const validatedData = updateUserSchema.parse(userData);

  if (
    validatedData.email &&
    validatedData.email !== existingUser.email
  ) {
    const emailOwner = await findUserByEmail(
      validatedData.email
    );

    if (emailOwner) {
      throw new Error("Email already exists.");
    }
  }

  const updateData = {};

  if (validatedData.firstName !== undefined) {
    updateData.firstName = validatedData.firstName;
  }

  if (validatedData.lastName !== undefined) {
    updateData.lastName = validatedData.lastName;
  }

  if (validatedData.email !== undefined) {
    updateData.email = validatedData.email;
  }

  if (validatedData.phone !== undefined) {
    updateData.phone = validatedData.phone;
  }

  if (validatedData.status !== undefined) {
    updateData.status = validatedData.status;
  }

  if (validatedData.roleId !== undefined) {
    updateData.roleId = Number(validatedData.roleId);
  }

  if (validatedData.departmentId !== undefined) {
    updateData.departmentId = Number(
      validatedData.departmentId
    );
  }

  if (validatedData.password) {
    updateData.password = await bcrypt.hash(
      validatedData.password,
      10
    );
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
  deleteExistingUser,
};