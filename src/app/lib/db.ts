import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "production"
      ? ["error"]
      : ["query", "error", "warn"],
    errorFormat: process.env.NODE_ENV === "production"
      ? "minimal"
      : "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismadb;
}

export async function connectToDB() {
  try {
    await prismadb.$connect();
    console.log("🚀 Database connected successfully");
    return prismadb;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error; // Let the application handle the error
  }
}

export async function disconnectFromDB() {
  try {
    await prismadb.$disconnect();
    console.log("👋 Database disconnected successfully");
  } catch (error) {
    console.error("❌ Database disconnect failed:", error);
    throw error; // Let the application handle the error
  }
}

export { prismadb };
