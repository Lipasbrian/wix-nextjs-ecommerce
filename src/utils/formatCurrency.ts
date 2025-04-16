/**
 * Formats a number into USD currency string
 * @param amount - The number to format as currency
 * @returns Formatted currency string (e.g., "$19.99")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};
