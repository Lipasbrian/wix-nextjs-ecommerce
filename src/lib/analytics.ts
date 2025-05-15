/**
 * Analytics utility for tracking user events
 */

// Add proper type for product
import type { Product } from '@/app/types';

// Define common event types for consistency
export const EventTypes = {
    VIEW_PRODUCT: 'product_view',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    CHECKOUT_START: 'checkout_start',
    PURCHASE_COMPLETE: 'purchase_complete',
    PRODUCT_SEARCH: 'product_search',
    PRODUCT_FILTER: 'product_filter',
    PRODUCT_CLICK: 'product_click',
};

// Define interfaces for clarity
interface EventMetadata {
    [key: string]: string | number | boolean | null | undefined;
    timestamp?: string;
    userAgent?: string;
    language?: string;
    referrer?: string;
}

// This interface can be used for future type safety
interface _TrackEventOptions {
    eventType: string;
    productId: string;
    vendorId: string;
    metadata?: EventMetadata;
}

/**
 * Track a user interaction event
 */
export const trackEvent = async (
    eventType: string,
    productId: string,
    vendorId: string,
    additionalMetadata = {}
) => {
    try {
        // Add validation
        if (!productId) {
            console.error('[Analytics] Cannot track event: productId is required');
            return false;
        }

        if (!vendorId) {
            console.error('[Analytics] Cannot track event: vendorId is required');
            return false;
        }

        console.log(`[Client] Tracking event: ${eventType} for product: ${productId}, vendor: ${vendorId}`);

        if (!productId || !vendorId) {
            console.error('[Client] Missing required tracking parameters:', {
                eventType, productId, vendorId
            });
            return;
        }

        const response = await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType,
                productId,
                vendorId,
                metadata: {
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    referrer: document.referrer,
                    ...additionalMetadata,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[Client] Analytics tracking failed:', errorData);
            return false;
        }

        const result = await response.json();
        console.log('[Client] Event tracked successfully:', result);
        return true;
    } catch (error) {
        console.error('[Client] Failed to track event:', error);
        return false;
    }
};

/**
 * Initialize analytics for a product page
 * Automatically tracks view events and sets up other event handlers
 */
export const useProductAnalytics = (product: Product) => {
    if (!product?.id || !product?.vendorId) {
        console.error('[Analytics] Product missing required fields:', product);
        return {
            trackAddToCart: () => { },
            trackRemoveFromCart: () => { },
        };
    }

    const productId = product.id;
    const vendorId = product.vendorId;

    // Track view immediately
    trackEvent(
        EventTypes.VIEW_PRODUCT,
        productId,
        vendorId
    );

    // Return handlers for other events
    return {
        trackAddToCart: (quantity = 1) =>
            trackEvent(
                EventTypes.ADD_TO_CART,
                productId,
                vendorId,
                { quantity }
            ),

        trackRemoveFromCart: (quantity = 1) =>
            trackEvent(
                EventTypes.REMOVE_FROM_CART,
                productId,
                vendorId,
                { quantity }
            )
    };
};

/**
 * Check the status of the analytics system
 */
export async function checkAnalyticsData() {
    try {
        const response = await fetch('/api/admin/analytics/check');
        const data = await response.json();
        console.log('Analytics system check:', data);
        return data.status === 'ok';
    } catch (error) {
        console.error('Analytics system error:', error);
        return false;
    }
}