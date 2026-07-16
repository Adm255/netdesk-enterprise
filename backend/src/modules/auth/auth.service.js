const bcrypt = require("bcrypt");

const {
  findUserByEmail,
  createUser
} = require("./auth.repository");

const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await createUser({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashedPassword,
    phone: userData.phone || null,
    roleId: 4,
    departmentId: 1
  });

  return newUser;
};

module.exports = {
  registerUser
};