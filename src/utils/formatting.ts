/**
 * Format number as Indian Rupee currency
 * @param value - Numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with rupee symbol
 */
export function formatCurrency(value: number | string | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '₹0.00';
  
  const num = Number(value) || 0;
  return `₹${num.toFixed(decimals)}`;
}

/**
 * Format number with specified decimal places
 * @param value - Numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with decimal places
 */
export function formatDecimal(value: number | string | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '0.00';
  
  const num = Number(value) || 0;
  return num.toFixed(decimals);
}

/**
 * Format percentage with specified decimal places
 * @param value - Numeric value to format as percentage
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with percent symbol
 */
export function formatPercent(value: number | string | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '0%';
  
  const num = Number(value) || 0;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format date to readable string
 * @param date - Date object or date string
 * @param format - Format type ('short', 'long', 'iso')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | null | undefined,
  format: 'short' | 'long' | 'iso' = 'short'
): string {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  switch (format) {
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    case 'long':
      return dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'short':
    default:
      return dateObj.toLocaleDateString('en-IN');
  }
}

/**
 * Format date and time together
 * @param date - Date object or date string
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format large numbers with abbreviations
 * @param value - Numeric value to format
 * @returns Formatted string (e.g., "1.2K", "1.5M")
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  }
  return value.toString();
}

/**
 * Format phone number to Indian format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '-';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
}
