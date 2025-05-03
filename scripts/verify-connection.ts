import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testConnection() {
    try {
        // Test basic connection
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
                createdAt: true
            }
        });
        console.log('Connected users:', users);
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();