import { SensorReading, SensorType } from '@/types';
import { ANOMALY_TYPES } from '@/lib/utils/constants';
import { isBusinessHours, isDaylight } from '@/lib/utils/helpers';

export interface AnomalyConfig {
  type: string;
  probability: number;
  affectedSensors: string[];
  condition?: (hour: number, date: Date) => boolean;
}

/**
 * Active anomalies in the system
 */
const activeAnomalies: Map<string, AnomalyConfig> = new Map();

/**
 * Initialize demo anomalies
 */
export function initializeDemoAnomalies() {
  // Anomaly 1: Meter Malfunction (Hot water high, electricity low)
  activeAnomalies.set('meter_malfunction_floor2', {
    type: ANOMALY_TYPES.METER_MALFUNCTION,
    probability: 1.0, // Always active for demo
    affectedSensors: ['water_hot_floor_2_north', 'electricity_floor_2_north'],
    condition: (hour) => hour >= 8 && hour <= 18, // During business hours
  });

  // Anomaly 2: Lighting Waste (Corridors lit during daylight)
  activeAnomalies.set('lighting_waste_corridors', {
    type: ANOMALY_TYPES.LIGHTING_WASTE,
    probability: 1.0,
    affectedSensors: ['lighting_floor_1_corridor', 'lighting_floor_2_corridor', 'lighting_floor_3_corridor'],
    condition: (hour) => hour >= 8 && hour < 18, // Daylight hours
  });

  // Anomaly 3: HVAC Inefficiency (Cooling empty zones)
  activeAnomalies.set('hvac_waste_conference', {
    type: ANOMALY_TYPES.HVAC_INEFFICIENCY,
    probability: 1.0,
    affectedSensors: ['hvac_floor_4_conference', 'temp_floor_4_conference', 'occupancy_floor_4_conference'],
    condition: (hour) => hour < 7 || hour > 20, // Outside business hours
  });

  // Anomaly 4: Water Leak (Gradual increase)
  activeAnomalies.set('water_leak_floor3', {
    type: ANOMALY_TYPES.WATER_LEAK,
    probability: 0.3, // 30% chance to trigger
    affectedSensors: ['water_cold_floor_3_south'],
  });

  // Anomaly 5: High CO2 (Poor ventilation)
  activeAnomalies.set('high_co2_floor1', {
    type: ANOMALY_TYPES.HIGH_CO2,
    probability: 0.5,
    affectedSensors: ['co2_floor_1_north'],
    condition: (hour) => hour >= 14 && hour <= 17, // Afternoon
  });
}

/**
 * Apply anomaly to sensor reading if applicable
 */
export function applyAnomaly(
  reading: SensorReading,
  hour: number,
  date: Date
): SensorReading {
  for (const [anomalyId, config] of activeAnomalies.entries()) {
    // Check if this sensor is affected
    if (!config.affectedSensors.some((pattern) => matchesSensorPattern(reading.sensorId, pattern))) {
      continue;
    }

    // Check condition
    if (config.condition && !config.condition(hour, date)) {
      continue;
    }

    // Check probability
    if (Math.random() > config.probability) {
      continue;
    }

    // Apply the specific anomaly
    return applySpecificAnomaly(reading, config.type, anomalyId);
  }

  return reading;
}

/**
 * Match sensor ID against pattern (supports wildcards)
 */
function matchesSensorPattern(sensorId: string, pattern: string): boolean {
  if (pattern.includes('*')) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(sensorId);
  }
  return sensorId === pattern;
}

/**
 * Apply specific anomaly type
 */
function applySpecificAnomaly(
  reading: SensorReading,
  anomalyType: string,
  anomalyId: string
): SensorReading {
  const modifiedReading = { ...reading };

  switch (anomalyType) {
    case ANOMALY_TYPES.METER_MALFUNCTION:
      if (reading.sensorType === 'water_meter_hot') {
        // Hot water meter reading abnormally high (3x normal)
        modifiedReading.value *= 3.4;
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
        };
      } else if (reading.sensorType === 'electricity_meter') {
        // Electricity meter reading abnormally low (should be high if heating water)
        modifiedReading.value *= 0.12;
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
        };
      }
      break;

    case ANOMALY_TYPES.LIGHTING_WASTE:
      if (reading.sensorType === 'lighting') {
        // Force lights ON during daylight hours
        modifiedReading.value = 1;
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
          wasteful: true,
        };
      }
      break;

    case ANOMALY_TYPES.HVAC_INEFFICIENCY:
      if (reading.sensorType === 'hvac_airflow') {
        // HVAC running at high capacity
        modifiedReading.value = 7500; // High airflow
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
        };
      } else if (reading.sensorType === 'temperature') {
        // Temperature being actively controlled
        modifiedReading.value = 21; // Cooled to 21°C
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
        };
      } else if (reading.sensorType === 'occupancy') {
        // But zone is empty
        modifiedReading.value = 0;
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
        };
      }
      break;

    case ANOMALY_TYPES.WATER_LEAK:
      if (reading.sensorType === 'water_meter_cold') {
        // Gradual increase in water consumption (leak)
        const leakRate = 1.5; // 50% increase
        modifiedReading.value *= leakRate;
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
          potentialLeak: true,
        };
      }
      break;

    case ANOMALY_TYPES.HIGH_CO2:
      if (reading.sensorType === 'co2_level') {
        // CO2 levels too high (poor ventilation)
        modifiedReading.value = 1400; // Above recommended 1000 ppm
        modifiedReading.metadata = {
          ...modifiedReading.metadata,
          anomaly: anomalyId,
          anomalyType,
          healthRisk: true,
        };
      }
      break;
  }

  return modifiedReading;
}

/**
 * Get list of active anomalies (for debugging/display)
 */
export function getActiveAnomalies(): AnomalyConfig[] {
  return Array.from(activeAnomalies.values());
}

/**
 * Clear all anomalies
 */
export function clearAnomalies() {
  activeAnomalies.clear();
}

/**
 * Add a custom anomaly
 */
export function addAnomaly(id: string, config: AnomalyConfig) {
  activeAnomalies.set(id, config);
}

/**
 * Remove a specific anomaly
 */
export function removeAnomaly(id: string) {
  activeAnomalies.delete(id);
}
