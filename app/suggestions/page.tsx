'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb, DollarSign, TrendingUp, Clock, CheckCircle2,
  ArrowRight, Zap, Droplet, ThermometerSun, Wind, Activity
} from 'lucide-react';

interface AnalysisResult {
  id?: string;
  type: string;
  summary: string;
  potentialSavings?: {
    amount: number;
    period: string;
  };
  recommendations: string[];
  confidence?: number;
  timestamp?: string;
}

export default function SuggestionsPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high-value' | 'quick-wins'>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch('/api/analysis');
      const data = await res.json();
      setAnalyses(data.recentAnalyses || []);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  }

  const getImpactBadge = (savings?: { amount: number; period: string }) => {
    if (!savings) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    if (savings.amount > 1000) return { label: 'High', color: 'bg-red-100 text-red-800' };
    if (savings.amount > 500) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Low', color: 'bg-green-100 text-green-800' };
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'efficiency':
        return <TrendingUp className="h-5 w-5" />;
      case 'anomaly':
        return <Activity className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const totalPotentialSavings = analyses.reduce((acc, analysis) => {
    return acc + (analysis.potentialSavings?.amount || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">AI Suggestions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Efficiency opportunities and optimization recommendations
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="text-sm min-h-[40px]"
          >
            All
          </Button>
          <Button
            variant={filter === 'high-value' ? 'default' : 'outline'}
            onClick={() => setFilter('high-value')}
            className="text-sm min-h-[40px]"
          >
            High Value
          </Button>
          <Button
            variant={filter === 'quick-wins' ? 'default' : 'outline'}
            onClick={() => setFilter('quick-wins')}
            className="text-sm min-h-[40px]"
          >
            Quick Wins
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Potential Savings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  ${totalPotentialSavings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">per month</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Recommendations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {analyses.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">opportunities identified</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {analyses.length > 0
                    ? Math.round(analyses.reduce((acc, a) => acc + (a.confidence || 85), 0) / analyses.length)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">AI accuracy score</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      {analyses.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No recommendations yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Run an AI analysis to get efficiency recommendations for your building
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {analyses.map((analysis, idx) => {
            const impact = getImpactBadge(analysis.potentialSavings);

            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                        {getIconForType(analysis.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <CardTitle className="text-base sm:text-lg break-words">{analysis.summary}</CardTitle>
                          <Badge className={impact.color}>{impact.label} Impact</Badge>
                          {analysis.confidence && analysis.confidence > 90 && (
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              High Confidence
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {analysis.type === 'efficiency' ? 'Efficiency Opportunity' : 'System Insight'} •{' '}
                          {analysis.timestamp
                            ? new Date(analysis.timestamp).toLocaleDateString()
                            : 'Recent'}
                        </CardDescription>
                      </div>
                    </div>
                    {analysis.potentialSavings && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${analysis.potentialSavings.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per {analysis.potentialSavings.period}</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Recommended Actions:
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {analysis.confidence && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">AI Confidence</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${analysis.confidence}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {analysis.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Tips Section */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">General Best Practices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: <Zap className="h-5 w-5" />,
              title: 'Energy Efficiency',
              tip: 'Schedule HVAC to match occupancy patterns',
              color: 'bg-yellow-100 text-yellow-700',
            },
            {
              icon: <Droplet className="h-5 w-5" />,
              title: 'Water Conservation',
              tip: 'Install low-flow fixtures and monitor for leaks',
              color: 'bg-blue-100 text-blue-700',
            },
            {
              icon: <ThermometerSun className="h-5 w-5" />,
              title: 'Temperature Control',
              tip: 'Maintain 20-22°C for optimal comfort and efficiency',
              color: 'bg-orange-100 text-orange-700',
            },
            {
              icon: <Wind className="h-5 w-5" />,
              title: 'Air Quality',
              tip: 'Regular HVAC maintenance improves air quality',
              color: 'bg-green-100 text-green-700',
            },
          ].map((item, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`inline-flex p-2 rounded-lg ${item.color} mb-3`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
