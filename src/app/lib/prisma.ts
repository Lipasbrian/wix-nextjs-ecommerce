import { PrismaClient } from "@prisma/client";

// Declare global prisma type
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a real PrismaClient instance or import the mock
let prismaClient: any;

// In development, use a global variable to prevent multiple instances
if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  // In development, use mock implementation
  if (!global.prisma) {
    // Create mock implementation
    global.prisma = {
      product: {
        findMany: async ({ where, orderBy }: any) => {
          console.log("Mock prisma findMany called with:", { where, orderBy });
          return [];
        },
        findUnique: async ({ where }: any) => {
          console.log("Mock prisma findUnique called with:", where);
          return null;
        }
      },
      cart: {
        findMany: async () => [],
        findFirst: async () => null,
        create: async () => ({ id: "mock-id" }),
        update: async () => ({ id: "mock-id" }),
        delete: async () => ({ id: "mock-id" })
      },
      cartItem: {
        findMany: async () => [],
        findFirst: async () => null,
        create: async () => ({ id: "mock-id" }),
        update: async () => ({ id: "mock-id" }),
        delete: async () => ({ id: "mock-id" })
      },
      vendorAnalytics: {
        findMany: async () => []
      }
    } as unknown as PrismaClient;
  }
  prismaClient = global.prisma;
}

export const prisma = prismaClient;
