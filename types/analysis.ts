export type AnalysisType = 'anomaly' | 'efficiency' | 'insight' | 'prediction';

export interface AnalysisResult {
  id: string;
  timestamp: Date;
  type: AnalysisType;
  confidence: number; // 0-1
  summary: string;
  details: string;
  recommendations: string[];
  potentialSavings?: {
    amount: number;
    unit: string;
    period: 'daily' | 'monthly' | 'yearly';
    currency?: string;
  };
  relatedSensors: string[];
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

export interface AnomalyDetection {
  sensorId: string;
  anomalyType:
    | 'spike'
    | 'drop'
    | 'correlation_break'
    | 'threshold_breach'
    | 'pattern_change';
  description: string;
  expectedValue: number;
  actualValue: number;
  deviation: number; // percentage
  timestamp: Date;
}

export interface EfficiencyOpportunity {
  id: string;
  title: string;
  description: string;
  area: 'lighting' | 'hvac' | 'water' | 'electricity' | 'general';
  potentialSavings: {
    energy?: number; // kWh
    cost?: number;   // currency
    water?: number;  // liters
    period: 'daily' | 'monthly' | 'yearly';
  };
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  estimatedPaybackPeriod?: string; // e.g., "3 months"
  recommendations: string[];
}

export interface InsightSummary {
  totalAnomalies: number;
  efficiencyOpportunities: number;
  potentialMonthlySavings: number;
  topRecommendations: string[];
  systemHealth: number; // 0-100
}
