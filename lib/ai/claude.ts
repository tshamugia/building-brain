import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Analyze sensor data using Claude
 */
export async function analyzeSensorData(prompt: string): Promise<string> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️  ANTHROPIC_API_KEY not set. Using mock analysis.');
      return getMockAnalysis();
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    return '';
  } catch (error) {
    console.error('Error calling Claude API:', error);
    // Fallback to mock data if API fails
    return getMockAnalysis();
  }
}

/**
 * Mock analysis for when API key is not available
 */
function getMockAnalysis(): string {
  return JSON.stringify({
    anomalies: [
      {
        id: 'mock_anomaly_1',
        type: 'meter_malfunction',
        severity: 'critical',
        title: 'Potential Meter Malfunction Detected',
        description:
          'Hot water consumption on Floor 2 is 340% above normal (2,450L vs typical 720L), but the electric water heater is drawing only 12% of expected power.',
        affectedSensors: ['water_hot_floor_2_north', 'electricity_floor_2_north'],
        recommendations: [
          'Dispatch technician to verify meter calibration on Floor 2, Zone B',
          'Check for unauthorized hot water source or bypass',
          'Review water heater operation logs',
        ],
        confidence: 0.92,
      },
    ],
    efficiencyOpportunities: [
      {
        id: 'mock_efficiency_1',
        area: 'lighting',
        title: 'Energy Saving Opportunity: Corridor Lighting',
        description:
          'Corridor lights on Floors 1-3 are operating continuously during daylight hours when natural light is sufficient.',
        potentialSavings: {
          energy: 4080,
          cost: 340,
          period: 'monthly',
        },
        recommendations: [
          'Implement daylight-based lighting control',
          'Install occupancy sensors in corridors',
          'Adjust lighting schedules to turn off during 8 AM - 6 PM',
        ],
        implementationDifficulty: 'easy',
        confidence: 0.88,
      },
      {
        id: 'mock_efficiency_2',
        area: 'hvac',
        title: 'HVAC Optimization Needed',
        description:
          'Conference Room Block (Floor 4) is being cooled to 21°C despite zero occupancy for 6+ hours outside business hours.',
        potentialSavings: {
          energy: 2100,
          cost: 890,
          period: 'monthly',
        },
        recommendations: [
          'Implement occupancy-based HVAC scheduling',
          'Set higher temperature setpoint (24°C) during unoccupied hours',
          'Enable automatic shutdown after 7 PM on weekdays',
        ],
        implementationDifficulty: 'medium',
        confidence: 0.85,
      },
    ],
    insights: [
      'Overall building energy efficiency is at 75% of optimal',
      'Peak demand occurs at 2-3 PM, consider load shifting opportunities',
      'Weekend energy consumption is 45% of weekday levels (expected: 30%)',
    ],
    systemHealth: 78,
  });
}
