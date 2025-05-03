import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
    try {
        console.log('Checking database tables...\n');

        const users = await prisma.user.count();
        console.log(`Users: ${users}`);

        const products = await prisma.product.count();
        console.log(`Products: ${products}`);

        const orders = await prisma.order.count();
        console.log(`Orders: ${orders}`);

        const analytics = await prisma.vendorAnalytics.count();
        console.log(`Vendor Analytics: ${analytics}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTables();