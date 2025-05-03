// Save this as check-db.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkConnection() {
  try {
    console.log("Testing PostgreSQL connection...");
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("Database connection successful!", result);

    console.log("Checking user table...");
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);

    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
