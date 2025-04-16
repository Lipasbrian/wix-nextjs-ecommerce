import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create Admin User
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: await hash('adminpass123', 10),
            emailVerified: new Date(),
            role: 'ADMIN'
        }
    })

    // Create Vendor User
    const vendorUser = await prisma.user.upsert({
        where: { email: 'vendor1@example.com' },
        update: {},
        create: {
            email: 'vendor1@example.com',
            name: 'John Vendor',
            password: await hash('password123', 10),
            emailVerified: new Date(),
            role: 'VENDOR'
        }
    })

    // Create Regular User
    const regularUser = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Regular User',
            password: await hash('userpass123', 10),
            emailVerified: new Date(),
            role: 'USER'
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
                userId: vendorUser.id
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
                vendorId: vendorUser.id,
                impressions: 5000,
                clicks: 250,
                ctr: 0.05
            },
            // ... 7 more analytics entries
        ]
    })

    // Create VendorAnalytics with unique dates
    const today = new Date()
    await prisma.vendorAnalytics.createMany({
        data: Array.from({ length: 7 }, (_, i) => ({
            vendorId: vendorUser.id,
            impressions: Math.floor(Math.random() * 10000),
            clicks: Math.floor(Math.random() * 1000),
            ctr: Math.random(),
            date: new Date(today.setDate(today.getDate() - i)) // Different date for each entry
        }))
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