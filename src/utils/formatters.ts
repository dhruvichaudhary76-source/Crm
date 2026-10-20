/**
 * Format numbers into Indian Rupee currency format (e.g., ₹1,25,000)
 */
export function formatINR(amount: number, showDecimals: boolean = false): string {
  if (isNaN(amount)) return '₹0';
  
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return formatted;
}

/**
 * Format date string (YYYY-MM-DD) into readable Indian/international format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const todayStr = getTodayString();
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateString === todayStr) {
    return 'Today';
  } else if (dateString === yesterdayStr) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format YYYY-MM into "Month Year" (e.g. October 2026)
 */
export function formatMonthYear(monthStr: string): string {
  // input: "2026-10"
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Get today's date formatted as YYYY-MM-DD
 */
export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
