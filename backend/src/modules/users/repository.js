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
    where: {
      id: Number(id)
    },
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
    where: {
      email
    }
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

const updateUser = async (id, data) => {
  return prisma.user.update({
    where: {
      id: Number(id)
    },
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

const deleteUser = async (id) => {
  return prisma.user.delete({
    where: {
      id: Number(id)
    }
  });
};

module.exports = {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser
};