const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Roles
  const roles = [
    { name: "Administrator", description: "System Administrator" },
    { name: "Manager", description: "Department Manager" },
    { name: "Technician", description: "IT Technician" },
    { name: "Employee", description: "Regular Employee" }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }

  // Departments
  const departments = [
    { name: "Information Technology", description: "IT Department" },
    { name: "Human Resources", description: "HR Department" },
    { name: "Finance", description: "Finance Department" },
    { name: "Operations", description: "Operations Department" }
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department.name },
      update: {},
      create: department
    });
  }

  // Development Administrator
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@netdesk.com"
    },
    update: {
  password: adminPassword,
  status: true,
  roleId: 1,
  departmentId: 1
},
create: {
      firstName: "NetDesk",
      lastName: "Administrator",
      email: "admin@netdesk.com",
      password: adminPassword,
      phone: null,
      status: true,
      roleId: 1,
      departmentId: 1
    }
  });

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });