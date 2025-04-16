import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create Users
    const user1 = await prisma.user.create({
        data: {
            email: 'vendor1@example.com',
            name: 'John Vendor',
            password: await hash('password123', 10),
            emailVerified: new Date(),  // Changed from boolean to Date
            role: 'VENDOR'              // Added role field
        }
    })

    // Create Ads
    const ads = await Promise.all([
        prisma.ad.create({
            data: {
                title: 'Summer Sale',
                description: 'Get 50% off on all summer items',
                budget: 1500.00,
                locations: ['Nairobi', 'Mombasa'],
                userId: user1.id
            }
        }),
        // ... create 7 more ads
    ])

    // Create Analytics for each Ad
    await Promise.all(ads.map(ad =>
        prisma.analytics.create({
            data: {
                adId: ad.id,
                impressions: Math.floor(Math.random() * 10000),
                clicks: Math.floor(Math.random() * 1000),
                location: ad.locations[0],
                date: new Date()
            }
        })
    ))

    // Create Products
    await prisma.product.createMany({
        data: [
            {
                name: 'Organic Coffee',
                description: 'Premium Arabica beans',
                price: 15.99,
                stock: 100
            },
            {
                name: 'Kenyan Tea',
                description: 'Premium black tea',
                price: 8.99,
                stock: 150
            },
            // ... 6 more products
        ]
    })

    // Create VendorAnalytics
    await prisma.vendorAnalytics.createMany({
        data: [
            {
                vendorId: user1.id,
                impressions: 5000,
                clicks: 250,
                ctr: 0.05
            },
            // ... 7 more analytics entries
        ]
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })