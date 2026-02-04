# Building Brain

AI-powered analytics platform for Building Management Systems (BMS)

## Demo MVP Features

- Real-time BMS sensor data simulation
- AI-powered anomaly detection
- Efficiency recommendations
- Interactive dashboard with charts

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Claude API key (optional - uses mock data if not provided):

```env
ANTHROPIC_API_KEY=your-key-here
```

Get your API key from: https://console.anthropic.com/

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### GET /api/sensors

Get all sensors with optional readings

```bash
curl http://localhost:3000/api/sensors?withReadings=true
```

### GET /api/buildings

Get building structure and stats

```bash
curl http://localhost:3000/api/buildings?withStats=true
```

### GET /api/alerts

Get all alerts

```bash
curl http://localhost:3000/api/alerts
```

### POST /api/analysis

Trigger AI analysis of current sensor data

```bash
curl -X POST http://localhost:3000/api/analysis
```

## Architecture

```
┌─────────────────────────────────────────┐
│        Next.js Frontend (React)          │
│  Dashboard │ Charts │ Alerts │ Insights │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Next.js API Routes               │
│  /sensors │ /alerts │ /analysis         │
└─────────────────────────────────────────┘
          │                │
┌──────────────────┐  ┌──────────────┐
│  Data Simulator  │  │  Claude AI   │
│  (BMS Data)      │  │  (Analysis)  │
└──────────────────┘  └──────────────┘
```

## Demo Use Cases

### 1. Meter Malfunction Detection

- Hot water consumption ↑ but electricity ↓
- AI detects correlation break
- Generates critical alert

### 2. Lighting Waste

- Corridor lights ON during daylight
- AI suggests schedule optimization
- Calculates potential savings ($340/month)

### 3. HVAC Inefficiency

- Cooling empty conference rooms after hours
- AI recommends occupancy-based control
- Estimates $890/month savings

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Charts**: Recharts
- **AI**: Claude API (Anthropic)
- **Data**: Simulated sensors with realistic patterns

## Project Structure

```
building-brain/
├── app/
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Dashboard page
├── components/        # React components
├── lib/
│   ├── simulator/     # BMS data simulator
│   ├── ai/            # Claude AI integration
│   ├── store/         # In-memory data store
│   └── utils/         # Helper functions
├── types/             # TypeScript definitions
└── docs/              # Documentation
```

## Development Status

- [x] Data simulator with anomalies
- [x] API routes
- [x] Claude AI integration
- [ ] Dashboard UI (in progress)
- [ ] Charts and visualizations
- [ ] Real-time updates

## Next Steps

1. Complete dashboard UI
2. Add real-time data streaming
3. Implement real BMS integration
4. Add user authentication
5. Multi-building support
