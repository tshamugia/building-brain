# Implementation Plan
# Building Brain - Demo MVP

**Timeline:** 5 Days
**Goal:** Working demo with simulated data and AI-powered analysis

---

## Day 1: Foundation

### Morning
- [x] Create PRD document
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup project structure
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Setup ESLint and Prettier

### Afternoon
- [ ] Create data models (TypeScript interfaces)
- [ ] Build sensor data simulator
  - Electricity meters
  - Water meters (hot/cold)
  - Temperature sensors
  - Humidity sensors
  - Occupancy sensors
  - Lighting status
- [ ] Implement anomaly injection system

### Deliverable
✅ Project skeleton + working data simulator

---

## Day 2: Backend & AI

### Morning
- [ ] Create API routes structure
  - `/api/sensors` - Get sensor readings
  - `/api/alerts` - Get/acknowledge alerts
  - `/api/analysis` - Trigger AI analysis
  - `/api/buildings` - Building hierarchy
- [ ] Implement in-memory data store

### Afternoon
- [ ] Integrate Claude API
- [ ] Create analysis prompts for:
  - Anomaly detection
  - Efficiency suggestions
  - Cross-sensor correlation
- [ ] Build alert generation system
- [ ] Implement Server-Sent Events for real-time updates

### Deliverable
✅ Working API with AI-powered analysis

---

## Day 3: Frontend - Dashboard Structure

### Morning
- [ ] Create layout components
  - Sidebar navigation
  - Header with building selector
  - Main content area
- [ ] Build dashboard page structure
- [ ] Implement building/floor/zone hierarchy UI

### Afternoon
- [ ] Create sensor card components
- [ ] Build real-time data display
- [ ] Implement data fetching hooks
- [ ] Connect to backend API

### Deliverable
✅ Dashboard skeleton with live data

---

## Day 4: Frontend - Visualization & Alerts

### Morning
- [ ] Implement charts
  - Energy consumption over time
  - Water usage trends
  - Temperature/humidity graphs
  - Occupancy patterns
- [ ] Create comparison views

### Afternoon
- [ ] Build alerts panel
  - Alert cards with severity
  - Acknowledge functionality
  - Filter by type/severity
- [ ] Create AI insights panel
  - Recommendations display
  - Savings calculations
  - Action items

### Deliverable
✅ Fully functional dashboard with charts and alerts

---

## Day 5: Integration & Polish

### Morning
- [ ] End-to-end testing
- [ ] Fix bugs and edge cases
- [ ] Performance optimization
- [ ] Add loading states and error handling

### Afternoon
- [ ] Demo scenario preparation
  - Configure anomaly scenarios
  - Prepare talking points
- [ ] Documentation
- [ ] Final testing

### Deliverable
✅ Demo-ready application

---

## Project Structure

```
building-brain/
├── docs/
│   ├── PRD.md
│   └── IMPLEMENTATION_PLAN.md
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── api/
│   │   │   ├── sensors/
│   │   │   │   └── route.ts
│   │   │   ├── alerts/
│   │   │   │   └── route.ts
│   │   │   ├── analysis/
│   │   │   │   └── route.ts
│   │   │   └── buildings/
│   │   │       └── route.ts
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── dashboard/
│   │   │   ├── SensorCard.tsx
│   │   │   ├── EnergyChart.tsx
│   │   │   ├── WaterChart.tsx
│   │   │   ├── TemperatureChart.tsx
│   │   │   └── OccupancyChart.tsx
│   │   ├── alerts/
│   │   │   ├── AlertPanel.tsx
│   │   │   ├── AlertCard.tsx
│   │   │   └── AlertFilters.tsx
│   │   └── insights/
│   │       ├── InsightsPanel.tsx
│   │       ├── RecommendationCard.tsx
│   │       └── SavingsDisplay.tsx
│   │
│   ├── lib/
│   │   ├── simulator/
│   │   │   ├── index.ts
│   │   │   ├── sensors.ts        # Sensor data generation
│   │   │   ├── anomalies.ts      # Anomaly injection
│   │   │   └── patterns.ts       # Normal patterns
│   │   ├── ai/
│   │   │   ├── claude.ts         # Claude API client
│   │   │   ├── prompts.ts        # Analysis prompts
│   │   │   └── analyzer.ts       # Analysis logic
│   │   ├── store/
│   │   │   └── index.ts          # In-memory data store
│   │   └── utils/
│   │       ├── constants.ts
│   │       └── helpers.ts
│   │
│   └── types/
│       ├── sensor.ts
│       ├── alert.ts
│       ├── analysis.ts
│       └── building.ts
│
├── public/
│   └── icons/
├── .env.local                    # Claude API key
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## Key Technical Decisions

### 1. Data Simulation Strategy

```typescript
// Realistic patterns with anomaly injection
const simulationConfig = {
  // Normal pattern: sine wave with noise
  electricity: {
    baseLoad: 150, // kWh base
    peakMultiplier: 2.5, // Peak hours multiplier
    noiseLevel: 0.1, // 10% random variance
    peakHours: [9, 10, 11, 14, 15, 16], // Business hours
  },

  // Anomaly injection
  anomalies: [
    {
      type: 'meter_malfunction',
      sensors: ['hot_water_floor_2'],
      trigger: 'random', // or 'scheduled'
      probability: 0.1, // 10% chance per interval
    },
    {
      type: 'lighting_waste',
      sensors: ['corridor_lights_*'],
      trigger: 'time_based',
      activeHours: [8, 18], // Daylight hours
    },
  ],
};
```

### 2. Claude AI Integration

```typescript
// Analysis prompt structure
const analyzeBuilding = async (sensorData: SensorReading[]) => {
  const prompt = `
    You are a building management AI analyst. Analyze the following sensor data
    and identify:
    1. Anomalies (unusual patterns, potential malfunctions)
    2. Efficiency opportunities (energy waste, optimization)
    3. Cross-sensor correlations that indicate problems

    Sensor Data:
    ${JSON.stringify(sensorData, null, 2)}

    Respond in JSON format with structure:
    {
      anomalies: [...],
      efficiencyOpportunities: [...],
      recommendations: [...]
    }
  `;

  return await claude.analyze(prompt);
};
```

### 3. Real-time Updates

Using Server-Sent Events for dashboard updates:

```typescript
// Server
export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const data = generateSensorUpdate();
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      }, 5000); // Update every 5 seconds
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

---

## Demo Scenarios

### Scenario 1: Meter Malfunction
1. Show normal water/electricity correlation
2. Inject anomaly (high water, low electricity)
3. AI detects and alerts
4. Show recommendation

### Scenario 2: Energy Waste
1. Display lighting status across floors
2. Show occupancy data (low during day)
3. AI suggests daylight-based control
4. Display potential savings

### Scenario 3: HVAC Inefficiency
1. Show temperature and occupancy
2. Demonstrate empty zone being cooled
3. AI recommends schedule adjustment
4. Calculate savings

---

## Environment Variables

```env
# .env.local
ANTHROPIC_API_KEY=your-api-key-here
SIMULATION_INTERVAL=5000
ANOMALY_PROBABILITY=0.1
```

---

## Getting Started Commands

```bash
# Initialize project
npx create-next-app@latest building-brain --typescript --tailwind --app

# Install dependencies
npm install @anthropic-ai/sdk recharts lucide-react

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add card button alert badge tabs

# Run development
npm run dev
```

---

## Next Steps After Demo

1. **Gather Feedback** - Present to potential customers
2. **Real Integration** - Start with one BMS (Siemens or Honeywell)
3. **Database** - Move to PostgreSQL for persistence
4. **Authentication** - Add user management
5. **Multi-tenant** - Support multiple buildings/companies
