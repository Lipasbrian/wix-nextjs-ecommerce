/**
 * Track user interactions with products
 */
export const trackEvent = async (
    eventType: string,
    productId: string,
    vendorId?: string,
    additionalMetadata = {}
) => {
    try {
        // Default vendorId fallback - you should provide this when calling the function
        // This is just a safety check for the API
        const finalVendorId = vendorId || "default-vendor-id";

        const response = await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventType,
                productId,
                vendorId: finalVendorId,
                metadata: {
                    timestamp: new Date().toISOString(),
                    source: 'web',
                    ...additionalMetadata
                }
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Analytics tracking error:', error);
        }
    } catch (error) {
        console.error('Failed to track event:', error);
    }
};

// Common event types
export const EventTypes = {
    VIEW_PRODUCT: 'product_view',
    ADD_TO_CART: 'add_to_cart',
    PURCHASE: 'purchase',
    REMOVE_FROM_CART: 'remove_from_cart',
    SEARCH: 'search',
};