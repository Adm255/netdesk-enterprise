const prisma = require("../../config/prisma");

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

const createUser = async (userData) => {
  return prisma.user.create({
    data: userData
  });
};

const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
      roleId: true,
      departmentId: true,
      createdAt: true
    }
  });
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById
};