import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Get all vendors from the database
    const vendors = await prisma.user.findMany({
        where: {
            OR: [
                { role: 'VENDOR' },
                { role: 'ADMIN' } // Include admins too as they might be vendors
            ]
        }
    });

    if (vendors.length === 0) {
        console.log('No vendors found. Please create some vendor accounts first.');
        return;
    }

    // Delete existing analytics data
    await prisma.vendorAnalytics.deleteMany();

    // For each vendor, create analytics data for the past 30 days
    for (const vendor of vendors) {
        console.log(`Creating analytics data for vendor: ${vendor.email}`);

        // Create trend patterns for more realistic data
        const impressionsTrend = Math.random() > 0.5 ? 'increasing' : 'decreasing';
        const clicksTrend = Math.random() > 0.5 ? 'increasing' : 'decreasing';

        let baseImpressions = Math.floor(Math.random() * 200) + 100; // Base between 100-300
        let baseClicks = Math.floor(Math.random() * 20) + 10; // Base between 10-30

        // Create data for past 30 days
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);

            // Generate impressions with some randomness and trend
            const trendFactor = impressionsTrend === 'increasing' ? (i / 30) : (1 - i / 30);
            const dailyImpressions = Math.floor(
                baseImpressions * (0.7 + (0.6 * trendFactor)) * (0.8 + Math.random() * 0.4)
            );

            // Generate clicks based on impressions with some randomness
            const clickRate = (0.05 + Math.random() * 0.15) * (clicksTrend === 'increasing' ? (1 + i / 60) : (1 - i / 60));
            const dailyClicks = Math.floor(dailyImpressions * clickRate);

            // Calculate CTR
            const ctr = (dailyClicks / dailyImpressions) * 100;

            // Weekend boost
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const weekendBoost = isWeekend ? 1.3 : 1;

            try {
                // FIXED: Only one create call with all fields
                await prisma.vendorAnalytics.create({
                    data: {
                        vendorId: vendor.id,
                        date,
                        impressions: Math.floor(dailyImpressions * weekendBoost),
                        clicks: Math.floor(dailyClicks * weekendBoost),
                        ctr: Math.min(ctr * (isWeekend ? 1.1 : 1), 30), // Cap CTR at 30%
                        revenue: parseFloat((dailyClicks * (Math.random() * 2 + 1)).toFixed(2))
                    }
                });
            } catch (error) {
                console.error(`Error creating analytics for ${vendor.email} on ${date}:`, error);
            }
        }

        console.log(`Created 31 days of analytics data for ${vendor.email}`);
    }

    console.log('Analytics data seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding analytics data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });