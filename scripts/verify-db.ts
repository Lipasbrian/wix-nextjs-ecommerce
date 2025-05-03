import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyConnection() {
    try {
        // Basic connection test
        console.log('Testing database connection...');
        const result = await prisma.$queryRaw`SELECT current_timestamp`;
        console.log('✅ Basic connection successful');

        // Check tables
        console.log('\nChecking database tables...');

        // Users
        const userCount = await prisma.user.count();
        console.log(`Users found: ${userCount}`);

        // Products
        const productCount = await prisma.product.count();
        console.log(`Products found: ${productCount}`);

        // Orders
        const orderCount = await prisma.order.count();
        console.log(`Orders found: ${orderCount}`);

    } catch (error) {
        console.error('❌ Database verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyConnection();