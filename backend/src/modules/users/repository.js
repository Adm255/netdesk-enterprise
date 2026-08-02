const prisma = require("../../config/prisma");

const findAllUsers = async () => {
  return prisma.user.findMany({
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
    },
    orderBy: {
      id: "asc"
    }
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

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

const createUser = async (data) => {
  return prisma.user.create({
    data,
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
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser
};
