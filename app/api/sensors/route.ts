import { NextRequest, NextResponse } from 'next/server';
import {
  initializeSimulator,
  getAllSensors,
  generateAllReadings,
  getHistoricalReadings,
  getSensorsByLocation,
} from '@/lib/simulator';

// Initialize simulator on first load
initializeSimulator();

/**
 * GET /api/sensors
 * Get all sensors or filter by query params
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const floor = searchParams.get('floor');
    const zone = searchParams.get('zone');
    const withReadings = searchParams.get('withReadings') === 'true';
    const sensorId = searchParams.get('id');
    const history = searchParams.get('history');

    // Get historical readings for specific sensor
    if (sensorId && history) {
      const hoursBack = parseInt(history) || 24;
      const readings = getHistoricalReadings(sensorId, hoursBack);
      return NextResponse.json({ sensorId, readings });
    }

    // Get sensors by location
    let sensors;
    if (floor || zone) {
      sensors = getSensorsByLocation(
        floor ? parseInt(floor) : undefined,
        zone || undefined
      );
    } else {
      sensors = getAllSensors();
    }

    // Include current readings if requested
    if (withReadings) {
      const readings = generateAllReadings();
      const sensorsWithReadings = sensors.map((sensor) => ({
        ...sensor,
        lastReading: readings.find((r) => r.sensorId === sensor.id),
      }));
      return NextResponse.json({ sensors: sensorsWithReadings, count: sensorsWithReadings.length });
    }

    return NextResponse.json({ sensors, count: sensors.length });
  } catch (error) {
    console.error('Error in /api/sensors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sensors' },
      { status: 500 }
    );
  }
}
