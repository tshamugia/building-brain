import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import type { AlertSeverity, AlertType } from '@/types';

/**
 * GET /api/alerts
 * Get all alerts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const unacknowledgedOnly = searchParams.get('unacknowledged') === 'true';
    const severity = searchParams.get('severity') as AlertSeverity | null;
    const type = searchParams.get('type') as AlertType | null;

    let alerts = unacknowledgedOnly
      ? dataStore.getUnacknowledgedAlerts()
      : dataStore.getAlerts();

    // Apply filters
    if (severity) {
      alerts = alerts.filter((a) => a.severity === severity);
    }
    if (type) {
      alerts = alerts.filter((a) => a.type === type);
    }

    // Calculate stats
    const stats = {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      warning: alerts.filter((a) => a.severity === 'warning').length,
      info: alerts.filter((a) => a.severity === 'info').length,
      unacknowledged: alerts.filter((a) => !a.acknowledged).length,
      resolvedToday: alerts.filter((a) => {
        if (!a.resolvedAt) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return a.resolvedAt >= today;
      }).length,
    };

    return NextResponse.json({ alerts, stats });
  } catch (error) {
    console.error('Error in GET /api/alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/alerts
 * Acknowledge an alert
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId, acknowledgedBy = 'user' } = body;

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    const alert = dataStore.acknowledgeAlert(alertId, acknowledgedBy);

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Error in PATCH /api/alerts:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge alert' },
      { status: 500 }
    );
  }
}
