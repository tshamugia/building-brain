import { Alert, AnalysisResult } from '@/types';

/**
 * In-memory store for demo purposes
 * In production, this would be a database
 */
class DataStore {
  private alerts: Map<string, Alert> = new Map();
  private analyses: Map<string, AnalysisResult> = new Map();

  // Alerts
  addAlert(alert: Alert): void {
    this.alerts.set(alert.id, alert);
  }

  getAlerts(): Alert[] {
    return Array.from(this.alerts.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  getAlertById(id: string): Alert | undefined {
    return this.alerts.get(id);
  }

  updateAlert(id: string, updates: Partial<Alert>): Alert | undefined {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;

    const updated = { ...alert, ...updates };
    this.alerts.set(id, updated);
    return updated;
  }

  acknowledgeAlert(id: string, acknowledgedBy: string): Alert | undefined {
    return this.updateAlert(id, {
      acknowledged: true,
      acknowledgedBy,
      acknowledgedAt: new Date(),
    });
  }

  getUnacknowledgedAlerts(): Alert[] {
    return this.getAlerts().filter((a) => !a.acknowledged);
  }

  clearAlerts(): void {
    this.alerts.clear();
  }

  // Analyses
  addAnalysis(analysis: AnalysisResult): void {
    this.analyses.set(analysis.id, analysis);
  }

  getAnalyses(): AnalysisResult[] {
    return Array.from(this.analyses.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  getRecentAnalyses(limit: number = 10): AnalysisResult[] {
    return this.getAnalyses().slice(0, limit);
  }

  clearAnalyses(): void {
    this.analyses.clear();
  }
}

// Export singleton instance
export const dataStore = new DataStore();
