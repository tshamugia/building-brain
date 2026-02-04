import { SensorType } from '@/types';
import {
  randomInRange,
  addNoise,
  sineWavePattern,
  isBusinessHours,
  isPeakHour,
  isWeekend,
  clamp,
} from '@/lib/utils/helpers';
import { SENSOR_CONFIGS, BUSINESS_HOURS } from '@/lib/utils/constants';

/**
 * Generate realistic sensor value based on time and patterns
 */
export function generateSensorValue(
  sensorType: SensorType,
  hour: number,
  date: Date = new Date()
): number {
  const config = SENSOR_CONFIGS[sensorType];
  const { baseValue, range, peakHours } = config;
  const [min, max] = range;

  switch (sensorType) {
    case 'electricity_meter':
      return generateElectricityValue(hour, date, baseValue, peakHours || []);

    case 'water_meter_cold':
    case 'water_meter_hot':
      return generateWaterValue(hour, date, baseValue, peakHours || []);

    case 'temperature':
      return generateTemperatureValue(hour, baseValue);

    case 'humidity':
      return generateHumidityValue(hour, baseValue);

    case 'occupancy':
      return generateOccupancyValue(hour, date);

    case 'lighting':
      return generateLightingValue(hour, date);

    case 'hvac_airflow':
      return generateHVACValue(hour, date, baseValue);

    case 'gas_meter':
      return generateGasValue(hour, date, baseValue);

    case 'co2_level':
      return generateCO2Value(hour, date, baseValue, peakHours || []);

    default:
      return clamp(addNoise(baseValue), min, max);
  }
}

/**
 * Electricity consumption pattern
 * - Higher during business hours
 * - Peak during mid-day
 * - Lower at night and weekends
 */
function generateElectricityValue(
  hour: number,
  date: Date,
  baseValue: number,
  peakHours: number[]
): number {
  let value = baseValue;

  // Weekend reduction
  if (isWeekend(date)) {
    value *= 0.3; // 70% reduction on weekends
  } else if (isBusinessHours(hour, BUSINESS_HOURS.start, BUSINESS_HOURS.end)) {
    // Business hours - higher consumption
    if (isPeakHour(hour, peakHours)) {
      value *= 2.5; // 150% increase during peak hours
    } else {
      value *= 1.5; // 50% increase during business hours
    }
  } else {
    // After hours - lower consumption
    value *= 0.5;
  }

  // Add sine wave pattern
  const amplitude = value * 0.2;
  value = sineWavePattern(hour, value, amplitude, 14); // Peak at 2 PM

  // Add realistic noise
  value = addNoise(value, 0.1);

  return clamp(value, 50, 600);
}

/**
 * Water consumption pattern
 * - Peak in morning and evening
 * - Lower during mid-day
 */
function generateWaterValue(
  hour: number,
  date: Date,
  baseValue: number,
  peakHours: number[]
): number {
  let value = baseValue;

  if (isWeekend(date)) {
    value *= 0.4;
  } else if (isPeakHour(hour, peakHours)) {
    value *= 2.0; // High usage during peak hours (morning/evening)
  } else if (isBusinessHours(hour, BUSINESS_HOURS.start, BUSINESS_HOURS.end)) {
    value *= 1.2;
  } else {
    value *= 0.3;
  }

  value = addNoise(value, 0.15);
  return clamp(value, 50, 1000);
}

/**
 * Temperature pattern
 * - Follows daily cycle
 * - Warmer during day, cooler at night
 */
function generateTemperatureValue(hour: number, baseValue: number): number {
  // Sine wave with peak at 2 PM (14:00)
  const amplitude = 3; // ±3°C variation
  let value = sineWavePattern(hour, baseValue, amplitude, 14);

  // Add small noise
  value = addNoise(value, 0.02);

  return clamp(value, 18, 28);
}

/**
 * Humidity pattern
 * - Inverse relationship with temperature
 * - Higher at night, lower during day
 */
function generateHumidityValue(hour: number, baseValue: number): number {
  // Inverse sine wave (peak at night)
  const amplitude = 10; // ±10% variation
  let value = sineWavePattern(hour, baseValue, amplitude, 2); // Peak at 2 AM

  value = addNoise(value, 0.05);
  return clamp(value, 25, 75);
}

/**
 * Occupancy pattern
 * - 0% outside business hours
 * - Gradual increase during morning
 * - Peak mid-day
 * - Gradual decrease evening
 */
function generateOccupancyValue(hour: number, date: Date): number {
  if (isWeekend(date)) {
    return addNoise(5, 0.5); // Minimal occupancy on weekends
  }

  if (!isBusinessHours(hour, BUSINESS_HOURS.start, BUSINESS_HOURS.end)) {
    return addNoise(2, 0.5); // Almost empty outside hours
  }

  // Gradual ramp up
  if (hour >= 7 && hour < 9) {
    const progress = (hour - 7) / 2;
    return addNoise(30 * progress, 0.1);
  }

  // Peak occupancy (9 AM - 5 PM)
  if (hour >= 9 && hour < 17) {
    return addNoise(75, 0.1);
  }

  // Gradual ramp down
  if (hour >= 17 && hour < 19) {
    const progress = 1 - (hour - 17) / 2;
    return addNoise(60 * progress, 0.1);
  }

  return clamp(addNoise(5, 0.5), 0, 100);
}

/**
 * Lighting status
 * - On during business hours
 * - Off at night (except emergency/security lights)
 */
function generateLightingValue(hour: number, date: Date): number {
  if (isWeekend(date)) {
    // Some lights on during weekend
    return Math.random() > 0.7 ? 1 : 0;
  }

  if (isBusinessHours(hour, 6, 20)) {
    // Lights mostly on during extended hours
    return Math.random() > 0.1 ? 1 : 0;
  }

  // Mostly off at night
  return Math.random() > 0.9 ? 1 : 0;
}

/**
 * HVAC airflow pattern
 * - Correlates with occupancy and temperature
 */
function generateHVACValue(hour: number, date: Date, baseValue: number): number {
  let value = baseValue;

  if (isWeekend(date)) {
    value *= 0.3; // Reduced on weekends
  } else if (isBusinessHours(hour, BUSINESS_HOURS.start, BUSINESS_HOURS.end)) {
    value *= 1.5; // Increased during business hours
  } else {
    value *= 0.4; // Minimal at night
  }

  value = addNoise(value, 0.12);
  return clamp(value, 1000, 9000);
}

/**
 * Gas consumption pattern
 * - Higher in winter/morning for heating
 * - Lower in summer
 */
function generateGasValue(hour: number, date: Date, baseValue: number): number {
  let value = baseValue;

  // Morning heating spike
  if (hour >= 6 && hour < 9) {
    value *= 2.0;
  } else if (isBusinessHours(hour, BUSINESS_HOURS.start, BUSINESS_HOURS.end)) {
    value *= 1.3;
  } else {
    value *= 0.5;
  }

  if (isWeekend(date)) {
    value *= 0.4;
  }

  value = addNoise(value, 0.15);
  return clamp(value, 10, 200);
}

/**
 * CO2 level pattern
 * - Correlates with occupancy
 * - Higher when more people present
 */
function generateCO2Value(
  hour: number,
  date: Date,
  baseValue: number,
  peakHours: number[]
): number {
  let value = baseValue;

  if (isWeekend(date)) {
    value *= 0.8;
  } else if (isPeakHour(hour, peakHours)) {
    value *= 1.6; // High CO2 during peak occupancy
  } else if (isBusinessHours(hour, BUSINESS_HOURS.start, BUSINESS_HOURS.end)) {
    value *= 1.3;
  }

  value = addNoise(value, 0.08);
  return clamp(value, 350, 1500);
}
