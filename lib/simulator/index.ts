import { SensorReading, Sensor, Location, SensorType } from '@/types';
import { generateId } from '@/lib/utils/helpers';
import { SENSOR_CONFIGS, BUILDING_CONFIG } from '@/lib/utils/constants';
import { generateSensorValue } from './patterns';
import { applyAnomaly, initializeDemoAnomalies } from './anomalies';

// Initialize sensors for the building
let sensors: Sensor[] = [];
let initialized = false;

/**
 * Initialize the simulator with demo building configuration
 */
export function initializeSimulator() {
  if (initialized) return;

  // Initialize demo anomalies
  initializeDemoAnomalies();

  // Generate sensors for each floor and zone
  sensors = [];
  const { floors, zonesPerFloor } = BUILDING_CONFIG;

  for (let floor = 1; floor <= floors; floor++) {
    for (const zone of zonesPerFloor) {
      const location: Location = {
        building: BUILDING_CONFIG.name,
        floor,
        zone,
      };

      // Add electricity meter per zone
      sensors.push(createSensor('electricity_meter', location));

      // Add water meters (cold and hot) per zone
      sensors.push(createSensor('water_meter_cold', location));
      sensors.push(createSensor('water_meter_hot', location));

      // Add environmental sensors
      sensors.push(createSensor('temperature', location));
      sensors.push(createSensor('humidity', location));
      sensors.push(createSensor('co2_level', location));

      // Add occupancy sensor
      sensors.push(createSensor('occupancy', location));

      // Add lighting sensor
      sensors.push(createSensor('lighting', location));

      // Add HVAC sensor
      sensors.push(createSensor('hvac_airflow', location));
    }
  }

  initialized = true;
  console.log(`✅ Simulator initialized with ${sensors.length} sensors`);
}

/**
 * Create a sensor with configuration
 */
function createSensor(type: SensorType, location: Location): Sensor {
  const config = SENSOR_CONFIGS[type];
  const sensorId = generateSensorId(type, location);

  return {
    id: sensorId,
    name: `${type} - Floor ${location.floor} ${location.zone}`,
    type,
    unit: config.unit,
    location,
    status: 'active',
    thresholds: {
      min: config.range[0],
      max: config.range[1],
    },
  };
}

/**
 * Generate sensor ID based on type and location
 */
function generateSensorId(type: SensorType, location: Location): string {
  const typeShort = type.replace('_meter', '').replace('_level', '');
  const zoneSafe = location.zone.toLowerCase().replace(/\s+/g, '_');
  return `${typeShort}_floor_${location.floor}_${zoneSafe}`;
}

/**
 * Get all sensors
 */
export function getAllSensors(): Sensor[] {
  if (!initialized) initializeSimulator();
  return sensors;
}

/**
 * Get sensors by location
 */
export function getSensorsByLocation(floor?: number, zone?: string): Sensor[] {
  if (!initialized) initializeSimulator();

  return sensors.filter((sensor) => {
    if (floor !== undefined && sensor.location.floor !== floor) return false;
    if (zone !== undefined && sensor.location.zone !== zone) return false;
    return true;
  });
}

/**
 * Get sensor by ID
 */
export function getSensorById(sensorId: string): Sensor | undefined {
  if (!initialized) initializeSimulator();
  return sensors.find((s) => s.id === sensorId);
}

/**
 * Generate current readings for all sensors
 */
export function generateAllReadings(date: Date = new Date()): SensorReading[] {
  if (!initialized) initializeSimulator();

  const hour = date.getHours();
  const readings: SensorReading[] = [];

  for (const sensor of sensors) {
    const reading = generateReading(sensor, date);
    readings.push(reading);
  }

  return readings;
}

/**
 * Generate a reading for a specific sensor
 */
export function generateReading(
  sensor: Sensor,
  date: Date = new Date()
): SensorReading {
  const hour = date.getHours();

  // Generate base value using patterns
  const value = generateSensorValue(sensor.type, hour, date);

  // Create reading
  let reading: SensorReading = {
    id: generateId('reading'),
    sensorId: sensor.id,
    sensorType: sensor.type,
    value,
    unit: sensor.unit,
    timestamp: date,
    location: sensor.location,
  };

  // Apply anomalies if applicable
  reading = applyAnomaly(reading, hour, date);

  return reading;
}

/**
 * Get readings for specific sensors
 */
export function getReadingsForSensors(
  sensorIds: string[],
  date: Date = new Date()
): SensorReading[] {
  if (!initialized) initializeSimulator();

  const readings: SensorReading[] = [];

  for (const sensorId of sensorIds) {
    const sensor = getSensorById(sensorId);
    if (sensor) {
      readings.push(generateReading(sensor, date));
    }
  }

  return readings;
}

/**
 * Get historical readings (simulated)
 */
export function getHistoricalReadings(
  sensorId: string,
  hoursBack: number = 24
): SensorReading[] {
  if (!initialized) initializeSimulator();

  const sensor = getSensorById(sensorId);
  if (!sensor) return [];

  const readings: SensorReading[] = [];
  const now = new Date();

  for (let i = 0; i < hoursBack; i++) {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    readings.push(generateReading(sensor, date));
  }

  return readings.reverse();
}

/**
 * Get building statistics
 */
export function getBuildingStats(date: Date = new Date()) {
  if (!initialized) initializeSimulator();

  const readings = generateAllReadings(date);

  const electricityReadings = readings.filter((r) => r.sensorType === 'electricity_meter');
  const waterReadings = readings.filter(
    (r) => r.sensorType === 'water_meter_cold' || r.sensorType === 'water_meter_hot'
  );
  const tempReadings = readings.filter((r) => r.sensorType === 'temperature');
  const occupancyReadings = readings.filter((r) => r.sensorType === 'occupancy');

  const totalElectricity = electricityReadings.reduce((sum, r) => sum + r.value, 0);
  const totalWater = waterReadings.reduce((sum, r) => sum + r.value, 0);
  const avgTemperature =
    tempReadings.reduce((sum, r) => sum + r.value, 0) / tempReadings.length;
  const avgOccupancy =
    occupancyReadings.reduce((sum, r) => sum + r.value, 0) / occupancyReadings.length;

  return {
    buildingId: BUILDING_CONFIG.name,
    energyConsumption: {
      today: totalElectricity,
      thisWeek: totalElectricity * 7,
      thisMonth: totalElectricity * 30,
      unit: 'kWh' as const,
    },
    waterConsumption: {
      today: totalWater,
      thisWeek: totalWater * 7,
      thisMonth: totalWater * 30,
      unit: 'L' as const,
    },
    averageTemperature: Math.round(avgTemperature * 10) / 10,
    averageOccupancy: Math.round(avgOccupancy),
    activeAlerts: 0, // Will be calculated by alert system
    efficiencyScore: 75, // Will be calculated by AI
  };
}
