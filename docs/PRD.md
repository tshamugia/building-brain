# Product Requirements Document (PRD)
# Building Brain - BMS Analytics Platform

**Version:** 1.0
**Date:** February 2026
**Status:** Draft - Demo Phase

---

## 1. Executive Summary

### 1.1 Product Vision
Building Brain is an AI-powered analytics platform that integrates with existing Building Management Systems (BMS) to provide actionable insights, anomaly detection, and efficiency recommendations for building owners and facility managers.

### 1.2 Problem Statement
Building owners and facility managers face several challenges:
- **Data Silos**: BMS systems collect vast amounts of data but lack intelligent analysis
- **Reactive Maintenance**: Problems are discovered after they cause damage or inefficiency
- **Energy Waste**: Lack of visibility into optimization opportunities costs money
- **Complex Interfaces**: Existing BMS dashboards require technical expertise
- **Problem early detection**
### 1.3 Solution
An AI-powered layer that sits on top of existing BMS systems to:
- Analyze sensor data in real-time
- Detect anomalies before they become problems
- Suggest efficiency improvements
- Present insights in simple, actionable language

---

## 2. Target Market

### 2.1 Primary Users
| Persona | Description | Pain Points |
|---------|-------------|-------------|
| **Building Owner** | Owns commercial/residential properties | Wants to reduce costs, increase efficiency |
| **Facility Manager** | Day-to-day building operations | Needs early warning for issues |
| **Property Manager** | Manages multiple buildings | Requires unified view across properties |

### 2.2 Target Buildings
- Commercial office buildings
- Residential complexes
- Shopping malls
- Business centers
- Hotels
- Industrial facilities
- Any building with integrated BMS

### 2.3 Supported BMS Systems (Future)
- Siemens Desigo CC
- Schneider Electric EcoStruxure
- Honeywell Building Management
- Johnson Controls Metasys
- Tridium Niagara
- Other BACnet/Modbus compatible systems

---

## 3. Product Features

### 3.1 Core Features (Demo/MVP)

#### 3.1.1 Data Simulation Engine
- Generate realistic BMS sensor data
- Include normal patterns and anomalies
- Support multiple sensor types:
  - Electricity meters (kWh, power factor)
  - Water meters (hot/cold)
  - HVAC sensors (temperature, humidity, airflow)
  - Lighting systems (on/off status, schedules)
  - Occupancy sensors

#### 3.1.2 AI Analytics Engine
- **Anomaly Detection**: Identify unusual patterns
  - Cross-sensor correlation (hot water high + electricity low = problem)
  - Historical deviation detection
  - Threshold-based alerts

- **Efficiency Analysis**: Find optimization opportunities
  - Lighting schedules vs. occupancy
  - HVAC optimization based on usage patterns
  - Peak demand management

- **Natural Language Insights**: Plain English recommendations
  - "Corridor lights on Floor 3 are running 6 hours during daylight. Turning them off could save $240/month"
  - "Hot water consumption spiked 300% but electricity remained flat. Possible meter malfunction or leak detected"

#### 3.1.3 Dashboard
- Real-time sensor data visualization
- Alert feed with priority levels
- Efficiency score and trends
- AI-generated recommendations
- Interactive charts and graphs

### 3.2 Future Features (Post-Demo)
- Real BMS integration (BACnet, Modbus, API)
- Multi-building management
- Predictive maintenance
- Energy cost forecasting
- Automated control suggestions
- Mobile app
- Report generation
- Integration with ticketing systems

---

## 4. Technical Requirements

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React/Next.js)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Dashboard  │  │   Alerts    │  │   AI Recommendations    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  REST API   │  │  WebSocket  │  │    Claude AI Service    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                               │
│  ┌─────────────────────┐  ┌───────────────────────────────────┐ │
│  │  Data Simulator     │  │  In-Memory Store (Demo)           │ │
│  │  (Generates BMS     │  │  PostgreSQL (Production)          │ │
│  │   sensor data)      │  │                                   │ │
│  └─────────────────────┘  └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 16 + React 19 + | SSR, TypeScript, fast development |
| **UI Components** | Tailwind CSS + shadcn/ui | Professional look, rapid prototyping |
| **Charts** | Recharts or Chart.js | Data visualization |
| **Backend** | Next.js API Routes | Simplified architecture for demo |
| **AI** | Claude API (Anthropic) | Advanced reasoning for anomaly detection |
| **Data** | In-memory + JSON files | Demo simplicity |
| **Real-time** | Server-Sent Events | Live updates |

### 4.3 Data Schema

#### Sensor Reading
```typescript
interface SensorReading {
  id: string;
  sensorId: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: Date;
  location: {
    building: string;
    floor: number;
    zone: string;
  };
}

type SensorType =
  | 'electricity_meter'
  | 'water_meter_cold'
  | 'water_meter_hot'
  | 'temperature'
  | 'humidity'
  | 'occupancy'
  | 'lighting'
  | 'hvac_airflow';
```

#### Alert
```typescript
interface Alert {
  id: string;
  type: 'anomaly' | 'efficiency' | 'maintenance';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  affectedSensors: string[];
  timestamp: Date;
  acknowledged: boolean;
}
```

#### AI Analysis Result
```typescript
interface AnalysisResult {
  id: string;
  timestamp: Date;
  type: 'anomaly' | 'efficiency' | 'insight';
  confidence: number;
  summary: string;
  details: string;
  recommendations: string[];
  potentialSavings?: {
    amount: number;
    unit: string;
    period: 'daily' | 'monthly' | 'yearly';
  };
  relatedSensors: string[];
}
```

---

## 5. Use Cases (Demo)

### 5.1 Anomaly Detection: Meter Malfunction

**Scenario**: Hot water consumption is abnormally high while electricity usage is very low.

**Detection Logic**:
- Hot water meter shows 3x normal consumption
- Electric water heater shows minimal power draw
- Correlation analysis flags inconsistency

**AI Output**:
> ⚠️ **Potential Meter Malfunction Detected**
>
> Hot water consumption on Floor 2 is 340% above normal (2,450L vs typical 720L), but the electric water heater is drawing only 12% of expected power.
>
> **Possible causes:**
> 1. Hot water meter malfunction (most likely)
> 2. Water heater bypass or manual override
> 3. Unauthorized hot water source
>
> **Recommended action:** Dispatch technician to verify meter calibration on Floor 2, Zone B.

### 5.2 Efficiency Suggestion: Lighting Optimization

**Scenario**: Corridor lights are on during daylight hours when natural light is sufficient.

**Detection Logic**:
- Lighting sensors show corridors lit 24/7
- Occupancy sensors show low foot traffic during day
- External light sensors indicate sufficient natural light

**AI Output**:
> 💡 **Energy Saving Opportunity**
>
> Corridor lights on Floors 1-3 are operating continuously. Analysis shows:
> - Daylight hours (8 AM - 6 PM): Natural light is sufficient
> - Occupancy during day: 23% of nighttime levels
>
> **Recommendation:** Implement daylight-based lighting control
>
> **Potential savings:** $340/month (~4,080 kWh)

### 5.3 Cross-System Analysis: HVAC Inefficiency

**Scenario**: HVAC running at full capacity in unoccupied zones.

**Detection Logic**:
- Temperature sensors show cooling active
- Occupancy sensors show empty zones
- Schedule shows outside business hours

**AI Output**:
> ❄️ **HVAC Optimization Needed**
>
> Conference Room Block (Floor 4) is being cooled to 21°C despite:
> - Zero occupancy detected for 6+ hours
> - Current time: 10:30 PM (outside business hours)
>
> **Recommendation:** Implement occupancy-based HVAC scheduling
>
> **Potential savings:** $890/month in cooling costs

---

## 6. Demo Scope

### 6.1 In Scope
- [x] Simulated sensor data generator (all sensor types)
- [x] Dashboard with real-time visualization
- [x] 3 core use cases demonstrated
- [x] Claude AI integration for analysis
- [x] Alert system with recommendations
- [x] Basic building/floor/zone hierarchy

### 6.2 Out of Scope (Demo)
- [ ] Real BMS integration
- [ ] User authentication
- [ ] Multi-tenant support
- [ ] Historical data storage
- [ ] Report generation
- [ ] Mobile responsive design
- [ ] Email/SMS notifications

---

## 7. Success Metrics (Demo)

| Metric | Target |
|--------|--------|
| Anomaly detection accuracy | Correctly identify all injected anomalies |
| Insight generation | Generate actionable recommendations |
| Dashboard load time | < 2 seconds |
| AI response time | < 5 seconds for analysis |

---

## 8. Implementation Timeline

### Week 1 (Current) - Demo MVP

| Day | Tasks |
|-----|-------|
| Day 1 | Project setup, data simulator |
| Day 2 | Backend API, Claude integration |
| Day 3 | Frontend dashboard structure |
| Day 4 | Charts, alerts, AI insights UI |
| Day 5 | Integration, testing, polish |

---

## 9. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Claude API rate limits | Analysis delays | Implement caching, batch analysis |
| Complex BMS protocols | Future integration difficulty | Design abstraction layer |
| Data accuracy for demo | Unrealistic scenarios | Work with building experts |

---

## 10. Future Roadmap

### Phase 2: Production MVP
- Real BMS integration (1-2 systems)
- PostgreSQL database
- User authentication
- Basic multi-building support

### Phase 3: Scale
- All major BMS integrations
- Predictive maintenance
- Mobile app
- Enterprise features

### Phase 4: Advanced
- ML-based predictions
- Automated control
- Carbon footprint tracking
- Regulatory compliance reporting

---

## Appendix A: Competitor Analysis

| Competitor | Strengths | Weaknesses |
|------------|-----------|------------|
| Siemens Navigator | Deep integration | Siemens-only, expensive |
| Schneider EcoStruxure | Comprehensive | Complex, vendor lock-in |
| Honeywell Forge | AI capabilities | Expensive, enterprise focus |
| **Building Brain** | Vendor-agnostic, AI-first, affordable | New entrant |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **BMS** | Building Management System |
| **BACnet** | Building Automation and Control Network protocol |
| **Modbus** | Industrial communication protocol |
| **HVAC** | Heating, Ventilation, and Air Conditioning |
| **kWh** | Kilowatt-hour (energy unit) |

