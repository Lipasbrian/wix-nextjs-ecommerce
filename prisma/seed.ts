import { PrismaClient } from '../prisma/generated/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        // Remove unused password variable

        // Create Admin User
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@example.com',
                name: 'Admin User',
                password: await hash('adminpass123', 10),
                role: 'ADMIN',
                emailVerified: new Date(),
            }
        });

        // Create Vendor User
        const vendorUser = await prisma.user.upsert({
            where: { email: 'vendor1@example.com' },
            update: {},
            create: {
                email: 'vendor1@example.com',
                name: 'John Vendor',
                password: await hash('vendorpass123', 10),
                role: 'VENDOR',
                emailVerified: new Date(),
            }
        });

        // Create Regular User
        const regularUser = await prisma.user.upsert({
            where: { email: 'user@example.com' },
            update: {},
            create: {
                email: 'user@example.com',
                name: 'Regular User',
                password: await hash('userpass123', 10),
                role: 'USER',
                emailVerified: new Date(),
            }
        });

        console.log({ adminUser, vendorUser, regularUser });
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error; // Re-throw to trigger the catch block below
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error('Error in seed script:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })