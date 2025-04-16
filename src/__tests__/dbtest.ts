import { prismadb } from "@/app/lib/db";

async function testConnection() {
  try {
    const userCount = await prismadb.user.count();
    console.log("✅ Database connected");
    console.log(`Users in database: ${userCount}`);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await prismadb.$disconnect();
  }
}

testConnection();
