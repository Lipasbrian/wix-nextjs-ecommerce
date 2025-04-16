import { Redis } from '@upstash/redis'

// Rate limit configuration
const RATE_LIMIT_REQUESTS = 60
const RATE_LIMIT_INTERVAL = 60 * 1000 // 1 minute in milliseconds

// Initialize Redis client with proper error handling
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export interface RateLimitResult {
    success: boolean
    remaining: number
    reset: number
}

export async function rateLimit(identifier: string): Promise<RateLimitResult> {
    const key = `rate-limit:${identifier}`

    try {
        const requests = await redis.incr(key)

        if (requests === 1) {
            await redis.expire(key, RATE_LIMIT_INTERVAL / 1000)
        }

        const ttl = await redis.ttl(key)

        if (requests > RATE_LIMIT_REQUESTS) {
            return {
                success: false,
                remaining: 0,
                reset: ttl
            }
        }

        return {
            success: true,
            remaining: RATE_LIMIT_REQUESTS - requests,
            reset: ttl
        }
    } catch (error) {
        console.error('Rate limit error:', error)
        // Fail open - allow request if rate limiting fails
        return {
            success: true,
            remaining: 1,
            reset: 0
        }
    }
}