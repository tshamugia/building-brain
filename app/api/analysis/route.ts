import { NextRequest, NextResponse } from 'next/server';
import { initializeSimulator, generateAllReadings } from '@/lib/simulator';
import { analyzeBuilding, getAnalysisSummary } from '@/lib/ai/analyzer';

// Initialize simulator
initializeSimulator();

/**
 * GET /api/analysis
 * Get analysis summary
 */
export async function GET() {
  try {
    const summary = getAnalysisSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error in GET /api/analysis:', error);
    return NextResponse.json(
      { error: 'Failed to get analysis summary' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analysis
 * Trigger a new analysis
 */
export async function POST(request: NextRequest) {
  try {
    // Generate current sensor readings
    const readings = generateAllReadings();

    console.log('🔍 Starting AI analysis of building data...');

    // Analyze with Claude AI
    const result = await analyzeBuilding(readings);

    console.log('✅ Analysis complete');
    console.log(`   - Generated ${result.alerts.length} alerts`);
    console.log(`   - Found ${result.analyses.length} efficiency opportunities`);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error in POST /api/analysis:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze building data',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
