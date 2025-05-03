import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';

const prisma = new PrismaClient();

async function exportAnalytics() {
    try {
        // Fetch analytics events
        const events = await prisma.analyticsEvent.findMany({
            include: {
                product: {
                    select: { name: true }
                },
                user: {
                    select: { name: true, email: true }
                },
                vendor: {
                    select: { name: true, email: true }
                }
            }
        });

        // Convert to CSV
        const csv = parse(events);

        // Create exports directory if it doesn't exist
        const exportDir = path.join(process.cwd(), 'exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir);
        }

        // Write CSV file
        const filename = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
        fs.writeFileSync(path.join(exportDir, filename), csv);

        console.log(`Analytics data exported successfully to ${filename}`);
    } catch (error) {
        console.error('Failed to export analytics:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the function
exportAnalytics();