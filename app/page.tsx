'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Zap, Droplet, ThermometerSun, AlertTriangle,
  CheckCircle2, TrendingUp, Activity, RefreshCw, Users
} from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AnalysisResult {
  summary: string;
  potentialSavings?: {
    amount: number;
    period: string;
  };
  recommendations: string[];
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Load building stats
      const statsRes = await fetch('/api/buildings?withStats=true');
      const statsData = await statsRes.json();
      setStats(statsData.stats);

      // Load alerts
      const alertsRes = await fetch('/api/alerts');
      const alertsData = await alertsRes.json();
      setAlerts(alertsData.alerts || []);

      // Load analyses
      const analysesRes = await fetch('/api/analysis');
      const analysesData = await analysesRes.json();
      setAnalyses(analysesData.recentAnalyses || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis() {
    try {
      setAnalyzing(true);
      const res = await fetch('/api/analysis', { method: 'POST' });
      const data = await res.json();

      // Reload data after analysis
      await loadData();
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'default';
      default:
        return 'secondary';
    }
  };

  // Mock chart data (would be from historical API in production)
  const energyData = [
    { date: '1 Jan', consumption: 320, cost: 48 },
    { date: '2 Jan', consumption: 280, cost: 42 },
    { date: '3 Jan', consumption: 380, cost: 57 },
    { date: '4 Jan', consumption: 420, cost: 63 },
    { date: '5 Jan', consumption: 340, cost: 51 },
    { date: '6 Jan', consumption: 290, cost: 43 },
    { date: '7 Jan', consumption: 380, cost: 57 },
    { date: '8 Jan', consumption: 410, cost: 61 },
    { date: '9 Jan', consumption: 350, cost: 52 },
    { date: '10 Jan', consumption: 400, cost: 60 },
    { date: '11 Jan', consumption: 390, cost: 58 },
    { date: '12 Jan', consumption: 450, cost: 67 },
  ];

  const zoneDistribution = [
    { name: 'North Wing', value: 28, color: '#3b82f6' },
    { name: 'South Wing', value: 24, color: '#8b5cf6' },
    { name: 'Corridors', value: 18, color: '#ec4899' },
    { name: 'Conference', value: 15, color: '#f59e0b' },
    { name: 'Offices', value: 15, color: '#10b981' },
  ];

  const floorComparison = [
    { floor: 'Floor 1', energy: 280, water: 420 },
    { floor: 'Floor 2', energy: 320, water: 380 },
    { floor: 'Floor 3', energy: 290, water: 360 },
    { floor: 'Floor 4', energy: 350, water: 440 },
    { floor: 'Floor 5', energy: 310, water: 400 },
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your building.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <Button onClick={runAnalysis} disabled={analyzing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Energy"
          value={`${stats?.energyConsumption.today.toFixed(0) || 0} kWh`}
          subtitle={`${stats?.energyConsumption.thisMonth.toFixed(0) || 0} kWh this month`}
          icon={Zap}
          iconColor="text-yellow-600"
          trend={{ value: 2.5, isPositive: true }}
        />
        <MetricCard
          title="Water Usage"
          value={`${stats?.waterConsumption.today.toFixed(0) || 0} L`}
          subtitle={`${stats?.waterConsumption.thisMonth.toFixed(0) || 0} L this month`}
          icon={Droplet}
          iconColor="text-blue-600"
          trend={{ value: 0.5, isPositive: false }}
        />
        <MetricCard
          title="Avg Temperature"
          value={`${stats?.averageTemperature || 0}°C`}
          subtitle={`${stats?.averageOccupancy || 0}% occupancy`}
          icon={ThermometerSun}
          iconColor="text-orange-600"
          trend={{ value: 0.2, isPositive: true }}
        />
        <MetricCard
          title="Active Alerts"
          value={alerts.filter(a => !a.acknowledged).length}
          subtitle={`${alerts.filter(a => a.severity === 'critical').length} critical issues`}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Energy Consumption Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Energy consumption</CardTitle>
                <CardDescription>Daily pattern over the last 12 days</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">Consumption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">Cost</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${energyData.reduce((acc, d) => acc + d.cost, 0).toFixed(0)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">2.5%</span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Zone Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Energy by zone</CardTitle>
            <CardDescription>Distribution across zones</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={zoneDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {zoneDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {zoneDistribution.map((zone, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{zone.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{zone.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floor Comparison and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Floor Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Floor comparison</CardTitle>
            <CardDescription>Energy and water usage by floor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={floorComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="floor"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="energy" fill="#3b82f6" name="Energy (kWh)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="water" fill="#06b6d4" name="Water (L)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent alerts</CardTitle>
            <CardDescription>
              {alerts.filter(a => !a.acknowledged).length} unacknowledged
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No alerts. Run analysis to detect issues.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                      alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity) as any} className="shrink-0">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {alert.description}
                      </p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
