'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar
} from 'recharts';
import {
  Zap, Droplet, TrendingUp, TrendingDown, DollarSign, Activity, Calendar
} from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  async function loadData() {
    try {
      setLoading(true);
      const statsRes = await fetch('/api/buildings?withStats=true');
      const statsData = await statsRes.json();
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Historical trend data
  const energyTrend = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    consumption: 300 + Math.random() * 200,
    cost: 45 + Math.random() * 30,
    baseline: 350,
  }));

  const waterTrend = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    cold: 400 + Math.random() * 200,
    hot: 200 + Math.random() * 100,
  }));

  const peakHours = [
    { hour: '00:00', load: 20 },
    { hour: '02:00', load: 15 },
    { hour: '04:00', load: 12 },
    { hour: '06:00', load: 25 },
    { hour: '08:00', load: 75 },
    { hour: '10:00', load: 90 },
    { hour: '12:00', load: 95 },
    { hour: '14:00', load: 100 },
    { hour: '16:00', load: 85 },
    { hour: '18:00', load: 60 },
    { hour: '20:00', load: 40 },
    { hour: '22:00', load: 30 },
  ];

  const costBreakdown = [
    { category: 'HVAC', cost: 4200, percentage: 45 },
    { category: 'Lighting', cost: 2100, percentage: 22 },
    { category: 'Equipment', cost: 1680, percentage: 18 },
    { category: 'Water Heating', cost: 840, percentage: 9 },
    { category: 'Other', cost: 560, percentage: 6 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detailed insights and trends for your building systems
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Monthly Energy Cost"
          value="$9,380"
          subtitle="vs $10,240 last month"
          icon={DollarSign}
          iconColor="text-green-600"
          trend={{ value: 8.4, isPositive: false }}
        />
        <MetricCard
          title="Avg Daily Consumption"
          value="386 kWh"
          subtitle="Peak: 512 kWh"
          icon={Zap}
          iconColor="text-yellow-600"
          trend={{ value: 3.2, isPositive: true }}
        />
        <MetricCard
          title="Water Efficiency"
          value="87%"
          subtitle="vs 84% last month"
          icon={Droplet}
          iconColor="text-blue-600"
          trend={{ value: 3.0, isPositive: true }}
        />
        <MetricCard
          title="Peak Load Time"
          value="2:00 PM"
          subtitle="Avg 95% capacity"
          icon={Activity}
          iconColor="text-purple-600"
        />
      </div>

      {/* Energy Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Energy consumption trend</CardTitle>
            <CardDescription>30-day historical data with baseline comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={energyTrend}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  interval={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  fill="url(#colorConsumption)"
                  name="Consumption (kWh)"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  name="Baseline"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost breakdown</CardTitle>
            <CardDescription>Monthly expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.category}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${item.cost.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${costBreakdown.reduce((acc, item) => acc + item.cost, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Usage and Peak Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Water consumption trend</CardTitle>
            <CardDescription>Cold and hot water usage over 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={waterTrend}>
                <defs>
                  <linearGradient id="colorCold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  interval={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cold"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="url(#colorCold)"
                  name="Cold Water (L)"
                />
                <Area
                  type="monotone"
                  dataKey="hot"
                  stackId="1"
                  stroke="#ef4444"
                  fill="url(#colorHot)"
                  name="Hot Water (L)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak load analysis</CardTitle>
            <CardDescription>Average hourly load distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={peakHours}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="load"
                  stroke="#8b5cf6"
                  fill="url(#colorLoad)"
                  name="Load %"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Peak Time</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">2:00 PM</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Off-Peak</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">4:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
