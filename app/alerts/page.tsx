'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, CheckCircle2, Clock, Filter, Search,
  AlertCircle, Info, XCircle, Activity
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
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      setLoading(true);
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function acknowledgeAlert(alertId: string) {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId,
          acknowledgedBy: 'Facility Manager',
        }),
      });
      await loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    // Filter by acknowledgment status
    if (filter === 'acknowledged' && !alert.acknowledged) return false;
    if (filter === 'unacknowledged' && alert.acknowledged) return false;

    // Filter by severity
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            System notifications and anomaly detections
          </p>
        </div>
        <Button onClick={loadAlerts}>
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.critical}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-600">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Warning</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.warning}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Info</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.info}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-600">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Unacknowledged</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.unacknowledged}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === 'unacknowledged' ? 'default' : 'outline'}
                onClick={() => setFilter('unacknowledged')}
                size="sm"
              >
                Unacknowledged
              </Button>
              <Button
                variant={filter === 'acknowledged' ? 'default' : 'outline'}
                onClick={() => setFilter('acknowledged')}
                size="sm"
              >
                Acknowledged
              </Button>
            </div>

            {/* Severity Filter */}
            <div className="flex gap-2">
              <Button
                variant={severityFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSeverityFilter('all')}
                size="sm"
              >
                All Severity
              </Button>
              <Button
                variant={severityFilter === 'critical' ? 'default' : 'outline'}
                onClick={() => setSeverityFilter('critical')}
                size="sm"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Critical
              </Button>
              <Button
                variant={severityFilter === 'warning' ? 'default' : 'outline'}
                onClick={() => setSeverityFilter('warning')}
                size="sm"
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
              >
                Warning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No alerts found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filter !== 'all' || severityFilter !== 'all' || searchQuery
                  ? 'Try adjusting your filters'
                  : 'Run an AI analysis to detect potential issues'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`hover:shadow-lg transition-shadow ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {alert.title}
                          </h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          onClick={() => acknowledgeAlert(alert.id)}
                          size="sm"
                          variant="outline"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Acknowledge
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {alert.description}
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">
                          Recommendation:
                        </span>
                        <span className="text-blue-800 dark:text-blue-400 ml-2">
                          {alert.recommendation}
                        </span>
                      </p>
                    </div>

                    {alert.acknowledged && alert.acknowledgedBy && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>
                          Acknowledged by {alert.acknowledgedBy}
                          {alert.acknowledgedAt && ` on ${new Date(alert.acknowledgedAt).toLocaleString()}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
