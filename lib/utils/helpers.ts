/**
 * Generate a random number within a range
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Add noise to a value (percentage-based)
 */
export function addNoise(value: number, noiseLevel: number = 0.1): number {
  const noise = (Math.random() - 0.5) * 2 * noiseLevel;
  return value * (1 + noise);
}

/**
 * Generate sine wave pattern for time-based data
 */
export function sineWavePattern(
  hour: number,
  baseValue: number,
  amplitude: number,
  peakHour: number = 12
): number {
  // Creates a sine wave with peak at peakHour
  const radians = ((hour - peakHour) / 12) * Math.PI;
  return baseValue + amplitude * Math.cos(radians);
}

/**
 * Check if current time is within business hours
 */
export function isBusinessHours(hour: number, start: number = 7, end: number = 19): boolean {
  return hour >= start && hour < end;
}

/**
 * Check if current hour is a peak hour
 */
export function isPeakHour(hour: number, peakHours: number[]): boolean {
  return peakHours.includes(hour);
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Calculate percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate day of week (0 = Sunday)
 */
export function getDayOfWeek(date: Date = new Date()): number {
  return date.getDay();
}

/**
 * Check if it's a weekend
 */
export function isWeekend(date: Date = new Date()): boolean {
  const day = getDayOfWeek(date);
  return day === 0 || day === 6;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if it's daylight hours (sunrise to sunset)
 */
export function isDaylight(hour: number): boolean {
  return hour >= 6 && hour < 19; // Approximate daylight: 6 AM - 7 PM
}
