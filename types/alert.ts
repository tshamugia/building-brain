export type AlertType = 'anomaly' | 'efficiency' | 'maintenance' | 'system';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  recommendation: string;
  affectedSensors: string[];
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  metadata?: {
    estimatedImpact?: string;
    urgency?: 'immediate' | 'soon' | 'routine';
    category?: string;
  };
}

export interface AlertStats {
  total: number;
  critical: number;
  warning: number;
  info: number;
  unacknowledged: number;
  resolvedToday: number;
}
