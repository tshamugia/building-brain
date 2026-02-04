import { SensorReading, Alert, AnalysisResult, AlertSeverity, AlertType } from '@/types';
import { analyzeSensorData } from './claude';
import { buildAnalysisPrompt } from './prompts';
import { generateId } from '@/lib/utils/helpers';
import { dataStore } from '@/lib/store';

interface ClaudeAnalysisResponse {
  anomalies: Array<{
    id?: string;
    type: string;
    severity: AlertSeverity;
    title: string;
    description: string;
    affectedSensors: string[];
    recommendations: string[];
    confidence: number;
  }>;
  efficiencyOpportunities: Array<{
    id?: string;
    area: string;
    title: string;
    description: string;
    potentialSavings: {
      energy?: number;
      cost?: number;
      period: 'daily' | 'monthly' | 'yearly';
    };
    recommendations: string[];
    implementationDifficulty: string;
    confidence: number;
  }>;
  insights: string[];
  systemHealth: number;
}

/**
 * Analyze current sensor readings and generate alerts/insights
 */
export async function analyzeBuilding(readings: SensorReading[]): Promise<{
  alerts: Alert[];
  analyses: AnalysisResult[];
  summary: string;
}> {
  try {
    // Build prompt from sensor data
    const prompt = buildAnalysisPrompt(readings);

    // Call Claude API
    const rawResponse = await analyzeSensorData(prompt);

    // Parse response
    let analysis: ClaudeAnalysisResponse;
    try {
      analysis = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      throw new Error('Invalid response from analysis engine');
    }

    // Convert anomalies to alerts
    const alerts: Alert[] = analysis.anomalies.map((anomaly) => {
      const alert: Alert = {
        id: anomaly.id || generateId('alert'),
        type: 'anomaly',
        severity: anomaly.severity,
        title: anomaly.title,
        description: anomaly.description,
        recommendation: anomaly.recommendations.join(' '),
        affectedSensors: anomaly.affectedSensors,
        timestamp: new Date(),
        acknowledged: false,
        metadata: {
          urgency: anomaly.severity === 'critical' ? 'immediate' : 'soon',
        },
      };

      // Store alert
      dataStore.addAlert(alert);

      return alert;
    });

    // Convert efficiency opportunities to analysis results
    const analyses: AnalysisResult[] = analysis.efficiencyOpportunities.map((opp) => {
      const result: AnalysisResult = {
        id: opp.id || generateId('analysis'),
        timestamp: new Date(),
        type: 'efficiency',
        confidence: opp.confidence,
        summary: opp.title,
        details: opp.description,
        recommendations: opp.recommendations,
        potentialSavings: opp.potentialSavings.cost
          ? {
              amount: opp.potentialSavings.cost,
              unit: 'USD',
              period: opp.potentialSavings.period,
            }
          : undefined,
        relatedSensors: [],
        priority: opp.implementationDifficulty === 'easy' ? 'high' : 'medium',
        actionRequired: true,
      };

      // Store analysis
      dataStore.addAnalysis(result);

      return result;
    });

    // Generate efficiency alert for high-value opportunities
    const highValueOpportunities = analysis.efficiencyOpportunities.filter(
      (opp) => (opp.potentialSavings.cost || 0) > 500
    );

    for (const opp of highValueOpportunities) {
      const efficiencyAlert: Alert = {
        id: generateId('alert'),
        type: 'efficiency',
        severity: 'info',
        title: opp.title,
        description: opp.description,
        recommendation: opp.recommendations.join(' '),
        affectedSensors: [],
        timestamp: new Date(),
        acknowledged: false,
        metadata: {
          estimatedImpact: `$${opp.potentialSavings.cost}/${opp.potentialSavings.period}`,
        },
      };

      alerts.push(efficiencyAlert);
      dataStore.addAlert(efficiencyAlert);
    }

    // Build summary
    const summary = `
Analysis Complete:
- ${alerts.length} alerts generated
- ${analyses.length} efficiency opportunities identified
- System health score: ${analysis.systemHealth}/100

Key Insights:
${analysis.insights.map((i) => `• ${i}`).join('\n')}
    `.trim();

    return { alerts, analyses, summary };
  } catch (error) {
    console.error('Error analyzing building:', error);
    throw error;
  }
}

/**
 * Get analysis summary for dashboard
 */
export function getAnalysisSummary() {
  const alerts = dataStore.getAlerts();
  const analyses = dataStore.getRecentAnalyses(5);

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
  const totalSavings = analyses.reduce((sum, a) => {
    return sum + (a.potentialSavings?.amount || 0);
  }, 0);

  return {
    totalAlerts: alerts.length,
    criticalAlerts,
    unacknowledgedAlerts: alerts.filter((a) => !a.acknowledged).length,
    totalPotentialSavings: totalSavings,
    recentAnalyses: analyses,
    topRecommendations: analyses
      .slice(0, 3)
      .map((a) => a.summary),
  };
}
