# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Building Brain is an AI-powered analytics platform for Building Management Systems (BMS). It uses Next.js 16 + React 19 for the frontend, Claude AI (Sonnet 4.5) for anomaly detection and efficiency recommendations, and simulates realistic BMS sensor data with embedded anomalies for demonstration purposes.

## Development Commands

### Setup
```bash
npm install
cp .env.example .env.local
# Add ANTHROPIC_API_KEY to .env.local (optional - uses mock data if not provided)
```

### Development
```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

Note: There are no tests configured yet.

## Architecture Overview

### Data Flow Pattern

The application uses a **simulation-first** architecture where all sensor data is procedurally generated based on time patterns, not stored statically:

1. **Sensor Generation**: 280 sensors across 5 floors, 4 zones per floor, 14 sensor types per zone
2. **Pattern-Based Reading Generation**: Each sensor type has unique temporal patterns (business hours, peak times, weekday/weekend variations)
3. **Anomaly Injection**: Demo anomalies are **always active** during business hours to showcase AI detection
4. **AI Analysis**: Claude API analyzes readings and generates alerts + efficiency recommendations
5. **In-Memory Storage**: Alerts and analyses stored in singleton `DataStore` (resets on restart)

### Key Components

#### API Routes (`app/api/`)

- **`/api/sensors`**: Get sensor metadata and readings
  - Query params: `floor`, `zone`, `withReadings`, `id` + `history` (for historical data)
  - Readings generated procedurally based on current/requested time

- **`/api/buildings`**: Get building structure with stats
  - Query param: `withStats` (calculates energy, water, temp, occupancy, efficiency score)

- **`/api/alerts`**: Get/update alerts
  - GET: Filter by `unacknowledged`, `severity`, `type`
  - PATCH: Acknowledge alerts with `{ alertId, acknowledgedBy }`

- **`/api/analysis`**: Trigger AI analysis
  - GET: Summary of recent analyses and alerts
  - POST: Generate readings → Claude analysis → Store alerts/analyses → Return results

#### Data Simulator (`lib/simulator/`)

**Critical Understanding**: The simulator is **not a mock** - it's a sophisticated engine that generates realistic BMS data with temporal patterns.

- **`patterns.ts`**: Contains per-sensor-type generation logic
  - Electricity: 1.5-2.5x business hours multiplier, sine wave peak at 2 PM
  - Water: Peak hours morning (7-9) and evening (17-20) with 2.0x multiplier
  - Occupancy: Gradual ramp-up 7-9 AM, 75% during 9-17, ramp-down 17-19
  - Temperature: Sine wave with 2 PM peak, ±3°C variation
  - All patterns: Weekend reduction (30-40%), noise injection for realism

- **`anomalies.ts`**: Demo anomaly configurations (always active during business hours)
  - **Meter Malfunction** (Floor 2 North): Hot water 3.4x high, electricity 0.12x low
  - **Lighting Waste** (Corridors 1-3): Lights ON during daylight hours
  - **HVAC Inefficiency** (Floor 4 Conference): Full airflow/cooling in empty zone after hours
  - **Water Leak** (Floor 3 South, 30% probability): Cold water 1.5x with gradual increase
  - **High CO2** (Floor 1 North, 50% probability): 1400 ppm during 2-5 PM

- **`index.ts`**: Sensor initialization and orchestration
  - `initializeSimulator()`: Creates 280 sensors (guards against re-initialization)
  - `generateAllReadings(date?)`: Generates all sensor readings for specified time
  - `generateReading(sensor, date?)`: Single sensor reading with anomaly application

#### AI Integration (`lib/ai/`)

- **`claude.ts`**: API client wrapper
  - Model: `claude-sonnet-4-5-20250929`
  - Max tokens: 2048
  - Graceful fallback to mock analysis if API key missing or request fails

- **`prompts.ts`**: Prompt engineering for analysis
  - Groups readings by type, marks anomalies
  - Requests JSON schema: anomalies, efficiency opportunities, insights, system health score

- **`analyzer.ts`**: Response processing
  - Parses Claude's JSON
  - Converts anomalies → `Alert` objects
  - Converts efficiency opportunities → `AnalysisResult` objects
  - Creates alerts for high-value opportunities (>$500/period)

#### Data Store (`lib/store/`)

Singleton in-memory store using Maps for O(1) lookups:
- `alerts`: Map<string, Alert>
- `analyses`: Map<string, AnalysisResult>

**Important**: Data resets on server restart (acceptable for demo/MVP phase). When extending to production, replace `DataStore` class implementation with database queries - the interface remains the same.

### Type System (`types/`)

All types are strongly typed with TypeScript. Key type hierarchies:

- **Sensor Types**: 10 types (electricity_meter, water_meter_cold/hot, temperature, humidity, occupancy, lighting, hvac_airflow, gas_meter, co2_level)
- **Building Structure**: Building → Floors → Zones → Sensors (hierarchical references)
- **Alert System**: 4 types (anomaly, efficiency, maintenance, system) × 3 severities (critical, warning, info)
- **Analysis Results**: 4 types (anomaly, efficiency, insight, prediction) with confidence scores

### Import Aliases

The project uses `@/*` path alias mapping to root directory:
```typescript
import { DataStore } from '@/lib/store';
import { Sensor } from '@/types';
```

## Development Patterns

### Adding New Sensor Types

1. Add type to `SensorType` enum in `types/sensor.ts`
2. Add unit to `SensorUnit` type
3. Add config to `SENSOR_CONFIGS` in `lib/utils/constants.ts`
4. Implement generation logic in `lib/simulator/patterns.ts` → `generateSensorValue()`
5. Update `initializeSimulator()` to create new sensor instances

### Adding New Anomalies

1. Define configuration object in `lib/simulator/anomalies.ts`
2. Add to `DEMO_ANOMALIES` array or call `addAnomaly()` during initialization
3. Implement `matchSensor` pattern (supports wildcards like `*_floor_*_zone`)
4. Add `condition` function for time-based activation
5. Set `probability` for stochastic activation

### Extending API Routes

All routes follow Next.js App Router patterns:
- Named exports: `GET`, `POST`, `PATCH`, `DELETE`
- Return `Response` or `NextResponse.json()`
- Call `initializeSimulator()` at module top-level
- Use query params for filtering, body for mutations
- Type responses with TypeScript

### Working with Time-Based Data

Readings are generated based on time, not stored:
- Pass `Date` object to `generateReading(sensor, date)` for specific times
- Use `generateAllReadings(date?)` for bulk generation
- Historical data: Loop backwards through time and generate on-the-fly
- Current data: Omit date parameter (defaults to `new Date()`)

## Environment Variables

- `ANTHROPIC_API_KEY`: Claude API key (optional - uses mock data if not set)
- `SIMULATION_INTERVAL`: Not currently used (intended for future real-time streaming)
- `ANOMALY_PROBABILITY`: Not currently used (anomalies configured in code)

## Key Architectural Decisions

1. **Procedural Generation Over Static Data**: Enables time-travel analysis, reduces memory footprint, easier to extend patterns

2. **In-Memory Store**: Acceptable for demo/MVP, zero-latency, easy to swap with database implementation

3. **Anomaly Injection**: Demo anomalies are **always active** to ensure AI showcases detection capabilities in every analysis

4. **Graceful AI Degradation**: If Claude API fails, fallback to hardcoded mock analysis maintaining full functionality

5. **Client-Side Dashboard**: No global state management (not needed for MVP scale), direct API fetches with loading states

6. **Type Safety**: All API responses, store operations, and data generation are strongly typed

## API Testing Examples

```bash
# Get all sensors with current readings
curl "http://localhost:3000/api/sensors?withReadings=true"

# Get sensors for specific floor and zone
curl "http://localhost:3000/api/sensors?floor=2&zone=North%20Wing&withReadings=true"

# Get historical readings for a sensor (24 hours)
curl "http://localhost:3000/api/sensors?id=electricity_floor_2_north_wing&history=24"

# Get building structure with stats
curl "http://localhost:3000/api/buildings?withStats=true"

# Get all alerts
curl "http://localhost:3000/api/alerts"

# Get unacknowledged critical alerts
curl "http://localhost:3000/api/alerts?unacknowledged=true&severity=critical"

# Trigger AI analysis
curl -X POST "http://localhost:3000/api/analysis"

# Get analysis summary
curl "http://localhost:3000/api/analysis"
```

## Future Extension Points

When scaling beyond MVP:

1. **Database Integration**: Replace `DataStore` class methods with SQL/NoSQL queries (interface stays same)
2. **Real BMS Integration**: Replace simulator calls with actual sensor API clients in `/api/sensors`
3. **Real-Time Updates**: Add WebSocket server, emit on data changes, client listeners
4. **Multi-Building Support**: Add building ID to all queries, filter in store/DB
5. **Time-Series DB**: Add InfluxDB/TimescaleDB for efficient historical analysis
6. **Authentication**: Add user context to alerts, analyses, acknowledgements
7. **Persistent Anomaly History**: Store anomaly detection history for ML improvement
