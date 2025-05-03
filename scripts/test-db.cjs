const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    const connTest = await prisma.$queryRaw`SELECT current_timestamp`;
    console.log("Connection test:", connTest);

    // Get all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name, (
        SELECT count(*) FROM information_schema.columns 
        WHERE table_name = t.table_name
      ) as column_count
      FROM (
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      ) t
    `;

    console.log("\nDatabase Tables:");
    console.table(tables);
  } catch (error) {
    console.error("Database Error:", error);
    console.log("Connection URL:", process.env.DATABASE_URL);
  } finally {
    await prisma.$disconnect();
  }
}

main();
