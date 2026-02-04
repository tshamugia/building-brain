import { SensorType, SensorUnit } from '@/types';

// Sensor configuration with realistic ranges and patterns
export const SENSOR_CONFIGS: Record<
  SensorType,
  {
    unit: SensorUnit;
    baseValue: number;
    range: [number, number];
    peakHours?: number[];
    seasonalFactor?: number;
  }
> = {
  electricity_meter: {
    unit: 'kWh',
    baseValue: 150, // Base load in kWh
    range: [100, 500],
    peakHours: [9, 10, 11, 14, 15, 16, 17], // Business hours
  },
  water_meter_cold: {
    unit: 'L',
    baseValue: 300,
    range: [200, 800],
    peakHours: [8, 9, 12, 13, 17, 18],
  },
  water_meter_hot: {
    unit: 'L',
    baseValue: 150,
    range: [100, 400],
    peakHours: [7, 8, 18, 19, 20],
  },
  temperature: {
    unit: '°C',
    baseValue: 22,
    range: [18, 26],
  },
  humidity: {
    unit: '%',
    baseValue: 45,
    range: [30, 70],
  },
  occupancy: {
    unit: '%',
    baseValue: 50,
    range: [0, 100],
    peakHours: [9, 10, 11, 14, 15, 16],
  },
  lighting: {
    unit: 'boolean',
    baseValue: 0,
    range: [0, 1],
  },
  hvac_airflow: {
    unit: 'm³/h',
    baseValue: 5000,
    range: [2000, 8000],
  },
  gas_meter: {
    unit: 'm³',
    baseValue: 50,
    range: [20, 150],
  },
  co2_level: {
    unit: 'ppm',
    baseValue: 600,
    range: [400, 1200],
    peakHours: [10, 11, 14, 15, 16],
  },
};

export const BUILDING_CONFIG = {
  name: 'Demo Business Center',
  floors: 5,
  zonesPerFloor: ['North Wing', 'South Wing', 'Corridor', 'Conference Room'],
};

export const BUSINESS_HOURS = {
  start: 7, // 7 AM
  end: 19,  // 7 PM
};

export const ANOMALY_TYPES = {
  METER_MALFUNCTION: 'meter_malfunction',
  LIGHTING_WASTE: 'lighting_waste',
  HVAC_INEFFICIENCY: 'hvac_inefficiency',
  WATER_LEAK: 'water_leak',
  TEMPERATURE_SPIKE: 'temperature_spike',
  HIGH_CO2: 'high_co2',
} as const;
