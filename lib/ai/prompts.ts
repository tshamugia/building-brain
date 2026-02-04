import { SensorReading } from '@/types';

/**
 * Build analysis prompt for Claude
 */
export function buildAnalysisPrompt(readings: SensorReading[]): string {
  // Group readings by type
  const groupedReadings: Record<string, SensorReading[]> = {};

  for (const reading of readings) {
    if (!groupedReadings[reading.sensorType]) {
      groupedReadings[reading.sensorType] = [];
    }
    groupedReadings[reading.sensorType].push(reading);
  }

  // Format readings for better readability
  const formattedReadings = Object.entries(groupedReadings).map(([type, sensors]) => {
    return `${type}:\n${sensors
      .map((s) => `  - ${s.location.floor}F ${s.location.zone}: ${s.value.toFixed(2)} ${s.unit}${s.metadata?.anomaly ? ' [ANOMALY]' : ''}`)
      .join('\n')}`;
  }).join('\n\n');

  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 7 && currentHour < 19;

  return `You are an expert building management system (BMS) analyst. Analyze the following sensor data from a commercial building and identify:

1. **Anomalies** - Unusual patterns, potential malfunctions, or issues that require immediate attention
2. **Efficiency Opportunities** - Ways to reduce energy consumption, water usage, or operating costs
3. **Cross-Sensor Correlations** - Relationships between sensors that indicate problems or opportunities

Context:
- Current time: ${new Date().toLocaleString()} (${isBusinessHours ? 'Business Hours' : 'After Hours'})
- Building type: Commercial Office Building
- Operating hours: 7 AM - 7 PM weekdays

Sensor Data:
${formattedReadings}

Analyze the data and respond in the following JSON format:

{
  "anomalies": [
    {
      "id": "unique_id",
      "type": "anomaly_type",
      "severity": "critical|warning|info",
      "title": "Brief title",
      "description": "Detailed description of what's wrong",
      "affectedSensors": ["sensor_ids"],
      "recommendations": ["action items"],
      "confidence": 0.0-1.0
    }
  ],
  "efficiencyOpportunities": [
    {
      "id": "unique_id",
      "area": "lighting|hvac|water|electricity|general",
      "title": "Brief title",
      "description": "Detailed description",
      "potentialSavings": {
        "energy": kWh_per_period,
        "cost": dollars_per_period,
        "period": "daily|monthly|yearly"
      },
      "recommendations": ["action items"],
      "implementationDifficulty": "easy|medium|hard",
      "confidence": 0.0-1.0
    }
  ],
  "insights": [
    "General insight 1",
    "General insight 2"
  ],
  "systemHealth": 0-100
}

Focus on:
- Correlation between water heaters and electricity usage
- Lighting usage during daylight hours vs occupancy
- HVAC operation in unoccupied zones
- Unusual spikes or drops in consumption
- CO2 levels relative to occupancy

Be specific with sensor locations and provide actionable recommendations. Calculate potential savings based on typical utility rates ($0.12/kWh electricity, $0.005/L water).`;
}
