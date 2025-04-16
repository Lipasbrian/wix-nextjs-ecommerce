import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "production"
    ? ["error"]
    : ["query", "error", "warn"],
  errorFormat: process.env.NODE_ENV === "production"
    ? "minimal"
    : "pretty",
})

if (process.env.NODE_ENV !== "production") global.prisma = prisma
