import { NextRequest, NextResponse } from 'next/server';
import { initializeSimulator, getBuildingStats, getAllSensors } from '@/lib/simulator';
import { BUILDING_CONFIG } from '@/lib/utils/constants';
import type { Building, Floor, Zone } from '@/types';

// Initialize simulator
initializeSimulator();

/**
 * GET /api/buildings
 * Get building structure and stats
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const withStats = searchParams.get('withStats') === 'true';

    // Build the building structure
    const sensors = getAllSensors();
    const floors: Floor[] = [];

    for (let floorNum = 1; floorNum <= BUILDING_CONFIG.floors; floorNum++) {
      const zones: Zone[] = BUILDING_CONFIG.zonesPerFloor.map((zoneName) => {
        const zoneSensors = sensors
          .filter((s) => s.location.floor === floorNum && s.location.zone === zoneName)
          .map((s) => s.id);

        return {
          id: `floor_${floorNum}_${zoneName.toLowerCase().replace(/\s+/g, '_')}`,
          name: zoneName,
          type: zoneName.toLowerCase().includes('corridor')
            ? 'corridor'
            : zoneName.toLowerCase().includes('conference')
            ? 'meeting_room'
            : 'office',
          area: 150, // Demo value
          sensors: zoneSensors,
        };
      });

      floors.push({
        number: floorNum,
        name: `Floor ${floorNum}`,
        zones,
        area: zones.reduce((sum, z) => sum + z.area, 0),
      });
    }

    const building: Building = {
      id: 'demo_building_1',
      name: BUILDING_CONFIG.name,
      address: '123 Business District, Demo City',
      type: 'commercial',
      floors,
      totalArea: floors.reduce((sum, f) => sum + f.area, 0),
      occupancy: 250,
      operatingHours: {
        start: '07:00',
        end: '19:00',
      },
      bmsSystem: {
        vendor: 'siemens',
        model: 'Desigo CC',
        version: '5.0',
      },
    };

    // Include stats if requested
    if (withStats) {
      const stats = getBuildingStats();
      return NextResponse.json({ building, stats });
    }

    return NextResponse.json({ building });
  } catch (error) {
    console.error('Error in /api/buildings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch building data' },
      { status: 500 }
    );
  }
}
