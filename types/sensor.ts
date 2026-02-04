export type SensorType =
  | 'electricity_meter'
  | 'water_meter_cold'
  | 'water_meter_hot'
  | 'temperature'
  | 'humidity'
  | 'occupancy'
  | 'lighting'
  | 'hvac_airflow'
  | 'gas_meter'
  | 'co2_level';

export type SensorUnit =
  | 'kWh'      // Electricity
  | 'kW'       // Power
  | 'L'        // Water volume
  | 'L/min'    // Water flow rate
  | '°C'       // Temperature
  | '%'        // Humidity, Occupancy
  | 'boolean'  // Lighting on/off
  | 'm³/h'     // Air flow
  | 'm³'       // Gas
  | 'ppm';     // CO2

export interface Location {
  building: string;
  floor: number;
  zone: string;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  sensorType: SensorType;
  value: number;
  unit: SensorUnit;
  timestamp: Date;
  location: Location;
  metadata?: {
    [key: string]: any;
  };
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  unit: SensorUnit;
  location: Location;
  status: 'active' | 'inactive' | 'error';
  lastReading?: SensorReading;
  thresholds?: {
    min?: number;
    max?: number;
    warning?: number;
  };
}

export interface SensorStats {
  sensorId: string;
  average: number;
  min: number;
  max: number;
  current: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}
