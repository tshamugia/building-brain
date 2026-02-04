export interface Building {
  id: string;
  name: string;
  address: string;
  type: 'commercial' | 'residential' | 'industrial' | 'mixed';
  floors: Floor[];
  totalArea: number; // square meters
  occupancy?: number;
  operatingHours?: {
    start: string; // HH:mm
    end: string;   // HH:mm
  };
  bmsSystem?: {
    vendor: 'siemens' | 'schneider' | 'honeywell' | 'johnson' | 'other';
    model: string;
    version: string;
  };
}

export interface Floor {
  number: number;
  name: string;
  zones: Zone[];
  area: number; // square meters
}

export interface Zone {
  id: string;
  name: string;
  type: 'office' | 'corridor' | 'meeting_room' | 'restroom' | 'lobby' | 'storage' | 'mechanical';
  area: number; // square meters
  sensors: string[]; // sensor IDs
}

export interface BuildingStats {
  buildingId: string;
  energyConsumption: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    unit: 'kWh';
  };
  waterConsumption: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    unit: 'L';
  };
  averageTemperature: number;
  averageOccupancy: number;
  activeAlerts: number;
  efficiencyScore: number; // 0-100
}
