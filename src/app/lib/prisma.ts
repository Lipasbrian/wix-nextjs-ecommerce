import { PrismaClient, Prisma } from "@prisma/client";

/**
 * Unified Prisma Client that supports:
 * 1. Singleton pattern to prevent multiple connections
 * 2. Environment-based logging configuration
 * 3. Optional mock data for development and testing
 * 4. Preservation of real connections for auth-related queries
 */

// Define the global type (use a unique name to avoid conflicts)
declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: PrismaClient | undefined;
}

// Configure client options based on environment
const clientOptions = {
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn'] as Prisma.LogLevel[]
        : ['error'] as Prisma.LogLevel[],
};

// Determine if we should use mocks (development only)
const useMocks = process.env.NODE_ENV !== 'production' &&
    process.env.USE_PRISMA_MOCKS === 'true';

// Create or reuse the Prisma client instance
let prisma: PrismaClient;

// Change this part:
if (!global.prismaGlobal) {
    try {
        global.prismaGlobal = new PrismaClient(clientOptions);
    } catch (error) {
        console.error("Failed to initialize Prisma Client:", error);

        // Create a more comprehensive mock client that includes auth models
        global.prismaGlobal = {
            $connect: () => Promise.resolve(),
            $disconnect: () => Promise.resolve(),
            user: {
                findUnique: async () => null,
                findFirst: async () => null,
                create: async () => ({ id: "mock-id" }),
            },
            account: {
                findFirst: async () => null,
                create: async () => ({ id: "mock-id" }),
            },
            session: {
                findMany: async () => [],
                create: async () => ({ id: "mock-id" }),
                deleteMany: async () => ({ count: 0 }),
            },
            // Other auth-related models
        } as unknown as PrismaClient;
    }
}

prisma = global.prismaGlobal;

// Apply mocking if enabled (development only)
if (useMocks) {
    console.log('🔶 Using Prisma mock mode for non-auth queries');

    // Create a proxy that selectively mocks non-auth operations
    prisma = new Proxy(prisma, {
        get(target, prop) {
            // These models always use real DB connection
            const authModels = ['user', 'account', 'session', 'verificationToken'];
            if (authModels.includes(prop as string)) {
                return target[prop as keyof PrismaClient];
            }

            // More flexible type definition for mock functions
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type MockFunction = (params: any) => Promise<unknown>;

            // Mock implementations for specific models
            const mockImplementations: Record<string, Record<string, MockFunction>> = {
                product: {
                    findMany: async ({ where, orderBy }) => {
                        console.log("Mock product.findMany called with:", { where, orderBy });
                        return [];
                    },
                    findUnique: async ({ where }) => {
                        console.log("Mock product.findUnique called with:", where);
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
            };

            // Return mock implementation if available
            if (mockImplementations[prop as string]) {
                return mockImplementations[prop as string];
            }

            // For any other models, return the original
            return target[prop as keyof PrismaClient];
        }
    }) as PrismaClient;
}

export { prisma };