"use client";

/**
 * Track ad impressions when they're viewed
 */
export const trackAdImpression = async (
    adId: string,
    position: number,
    adTitle: string,
    vendorId: string = "system"
) => {
    try {
        const response = await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'adImpression',
                adId,
                position,
                adTitle,
                vendorId,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            console.error('Failed to track ad impression');
        }
    } catch (error) {
        console.error('Error tracking ad impression:', error);
    }
};

/**
 * Track ad clicks when users interact with ads
 */
export const trackAdClick = async (
    adId: string,
    position: number,
    adTitle: string,
    vendorId: string = "system"
) => {
    try {
        const response = await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'adClick',
                adId,
                position,
                adTitle,
                vendorId,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            console.error('Failed to track ad click');
        }
    } catch (error) {
        console.error('Error tracking ad click:', error);
    }
};

/**
 * Track product views
 */
export async function trackProductView(productId: string) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'productView',
                productId,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Failed to track product view:', error);
    }
}

/**
 * Track product impression in a list
 */
export async function trackProductImpression(productId: string, listName: string = 'product_list') {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'productImpression',
                productId,
                listName,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Failed to track product impression:', error);
    }
}

/**
 * Track product clicks from a list
 */
export async function trackProductClick(productId: string) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'productClick',
                productId,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Failed to track product click:', error);
    }
}

/**
 * Track add to cart events
 */
export async function trackAddToCart(productId: string, quantity: number) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'addToCart',
                productId,
                quantity,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Failed to track add to cart:', error);
    }
}

/**
 * Track remove from cart events
 */
export async function trackRemoveFromCart(productId: string, quantity: number) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'removeFromCart',
                productId,
                quantity,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Failed to track remove from cart:', error);
    }
}

/**
 * Track checkout begin events
 */
export async function trackBeginCheckout(products: { productId: string, quantity: number }[]) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'beginCheckout',
                products,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Failed to track checkout begin:', error);
    }
}

/**
 * Track purchase completed events
 */
export async function trackPurchase(orderId: string, products: { productId: string, quantity: number, price: number }[], total: number) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType: 'purchase',
                orderId,
                products,
                total,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Failed to track purchase:', error);
    }
}
