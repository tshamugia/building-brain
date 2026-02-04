'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, Zap, Droplet, ThermometerSun, Activity } from 'lucide-react';

export default function BuildingsPage() {
  const [building, setBuilding] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch('/api/buildings?withStats=true');
      const data = await res.json();
      setBuilding(data);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading building data:', error);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Building Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Detailed information about your building structure and zones
        </p>
      </div>

      {/* Building Info Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{building?.name || 'Demo Business Center'}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    123 Innovation Street, Tech District
                  </span>
                  <Badge>Active</Badge>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Building ID</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{building?.id || 'demo_building_001'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Floors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {building?.floors?.length || 5}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Zones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {building?.floors?.reduce((acc: number, f: any) => acc + (f.zones?.length || 0), 0) || 20}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sensors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">280</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Building Type</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Commercial</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-yellow-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Energy Consumption</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.energyConsumption?.today.toFixed(0) || 0} kWh
                </p>
                <p className="text-xs text-gray-500 mt-1">Today</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Water Usage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.waterConsumption?.today.toFixed(0) || 0} L
                </p>
                <p className="text-xs text-gray-500 mt-1">Today</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Droplet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Temperature</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.averageTemperature || 0}°C
                </p>
                <p className="text-xs text-gray-500 mt-1">Across all zones</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <ThermometerSun className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floors Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Floor Overview</h2>
        <div className="space-y-4">
          {building?.floors?.map((floor: any) => (
            <Card key={floor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Floor {floor.floorNumber}</CardTitle>
                    <CardDescription>{floor.zones?.length || 0} zones</CardDescription>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {floor.zones?.map((zone: any) => (
                    <div
                      key={zone.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                        {zone.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {zone.type || 'General'}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Activity className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No zones configured</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )) || (
            <p className="text-center text-gray-500 py-8">No floor data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
