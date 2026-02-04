import { Site, Asset, Alarm, SiteKPI, Forecast, SolutionTemplate } from '@/types/industrial';

// Mock Sites / Plants
export const mockSites: Site[] = [
  {
    id: 'taj-sulfonation',
    name: 'TAJ – Sulfonation Unit',
    location: 'Tehran, Iran',
    type: 'unit',
    status: 'running',
    healthScore: 92,
  },
  {
    id: 'plant-b',
    name: 'Plant B – Refinery',
    location: 'Bandar Abbas, Iran',
    type: 'refinery',
    status: 'running',
    healthScore: 89,
  },
  {
    id: 'plant-c',
    name: 'Plant C – Petrochemical',
    location: 'Assaluyeh, Iran',
    type: 'plant',
    status: 'warning',
    healthScore: 78,
  },
  {
    id: 'factory-d',
    name: 'Factory D – Manufacturing',
    location: 'Isfahan, Iran',
    type: 'factory',
    status: 'running',
    healthScore: 95,
  },
];

// Mock Assets per Site
export const mockAssets: Asset[] = [
  // TAJ Sulfonation Unit
  {
    id: 'taj-compressor-1',
    name: 'Compressor',
    siteId: 'taj-sulfonation',
    type: 'compressor',
    status: 'normal',
    predictedFailure: '14 days',
    lastAnomaly: '20 hours ago',
    metrics: [
      { name: 'Pressure', value: 7.8, unit: 'bar', trend: 'stable', lastUpdated: '14 sec ago' },
    ],
  },
  {
    id: 'taj-pump-a',
    name: 'Pump A',
    siteId: 'taj-sulfonation',
    type: 'pump',
    status: 'warning',
    predictedFailure: '7 days',
    lastAnomaly: '2 hours ago',
    metrics: [
      { name: 'Vibration', value: 3.5, unit: 'mm/s', trend: 'up', lastUpdated: '10 min ago' },
    ],
  },
  {
    id: 'taj-furnace-b',
    name: 'Furnace B',
    siteId: 'taj-sulfonation',
    type: 'furnace',
    status: 'critical',
    predictedFailure: null,
    lastAnomaly: '5 minutes ago',
    metrics: [
      { name: 'Temperature', value: 850, unit: '°C', trend: 'up', lastUpdated: '10 sec ago' },
    ],
  },
  // Plant B Refinery
  {
    id: 'plantb-compressor-1',
    name: 'Compressor',
    siteId: 'plant-b',
    type: 'compressor',
    status: 'normal',
    predictedFailure: '14 days',
    lastAnomaly: '20h ago',
    metrics: [
      { name: 'Pressure', value: 8.2, unit: 'bar', trend: 'stable', lastUpdated: '5 sec ago' },
    ],
  },
  {
    id: 'plantb-pump-a',
    name: 'Pump A',
    siteId: 'plant-b',
    type: 'pump',
    status: 'warning',
    predictedFailure: '2 days',
    lastAnomaly: '7h ago',
    metrics: [
      { name: 'Vibration', value: 4.1, unit: 'mm/s', trend: 'up', lastUpdated: '2 min ago' },
    ],
  },
  {
    id: 'plantb-furnace-b',
    name: 'Furnace B',
    siteId: 'plant-b',
    type: 'furnace',
    status: 'normal',
    predictedFailure: null,
    lastAnomaly: '5 min ago',
    metrics: [
      { name: 'Temperature', value: 780, unit: '°C', trend: 'stable', lastUpdated: '8 sec ago' },
    ],
  },
  // Plant C Petrochemical
  {
    id: 'plantc-compressor-1',
    name: 'Compressor A',
    siteId: 'plant-c',
    type: 'compressor',
    status: 'critical',
    predictedFailure: '2 days',
    lastAnomaly: '30 min ago',
    metrics: [
      { name: 'Pressure', value: 6.5, unit: 'bar', trend: 'down', lastUpdated: '1 min ago' },
    ],
  },
  {
    id: 'plantc-heat-exchanger',
    name: 'Heat Exchanger',
    siteId: 'plant-c',
    type: 'heat_exchanger',
    status: 'warning',
    predictedFailure: '5 days',
    lastAnomaly: '2h ago',
    metrics: [
      { name: 'Efficiency', value: 82, unit: '%', trend: 'down', lastUpdated: '5 min ago' },
    ],
  },
  // Factory D
  {
    id: 'factoryd-motor-1',
    name: 'Motor A',
    siteId: 'factory-d',
    type: 'motor',
    status: 'normal',
    predictedFailure: '30 days',
    lastAnomaly: '2 days ago',
    metrics: [
      { name: 'Current', value: 45, unit: 'A', trend: 'stable', lastUpdated: '3 sec ago' },
    ],
  },
];

// Mock Alarms
export const mockAlarms: Alarm[] = [
  {
    id: 'alarm-1',
    siteId: 'taj-sulfonation',
    assetId: 'taj-furnace-b',
    severity: 'critical',
    message: 'Furnace B temperature exceeding safe limits',
    timestamp: '5 minutes ago',
    acknowledged: false,
  },
  {
    id: 'alarm-2',
    siteId: 'taj-sulfonation',
    assetId: 'taj-pump-a',
    severity: 'warning',
    message: 'Pump A vibration levels elevated',
    timestamp: '2 hours ago',
    acknowledged: false,
  },
  {
    id: 'alarm-3',
    siteId: 'plant-b',
    assetId: 'plantb-pump-a',
    severity: 'warning',
    message: 'Pump A requires maintenance',
    timestamp: '7 hours ago',
    acknowledged: true,
  },
  {
    id: 'alarm-4',
    siteId: 'plant-c',
    assetId: 'plantc-compressor-1',
    severity: 'critical',
    message: 'Compressor A pressure drop detected',
    timestamp: '30 minutes ago',
    acknowledged: false,
  },
];

// Mock KPIs per Site
export const mockSiteKPIs: SiteKPI[] = [
  {
    siteId: 'taj-sulfonation',
    healthScore: 92,
    activeAlarms: { critical: 4, warning: 4, info: 11 },
    energyConsumption: 2.4,
    energyUnit: 'MWh',
    downTimeRisk: 5,
    riskTimeframe: 'Next Week',
    carbonFootprint: 34.5,
  },
  {
    siteId: 'plant-b',
    healthScore: 89,
    activeAlarms: { critical: 2, warning: 2, info: 8 },
    energyConsumption: 3.1,
    energyUnit: 'MWh',
    downTimeRisk: 10.5,
    riskTimeframe: 'Next Week',
    carbonFootprint: 42.3,
  },
  {
    siteId: 'plant-c',
    healthScore: 78,
    activeAlarms: { critical: 5, warning: 8, info: 15 },
    energyConsumption: 4.2,
    energyUnit: 'MWh',
    downTimeRisk: 15,
    riskTimeframe: 'Next Week',
    carbonFootprint: 58.1,
  },
  {
    siteId: 'factory-d',
    healthScore: 95,
    activeAlarms: { critical: 0, warning: 1, info: 3 },
    energyConsumption: 1.8,
    energyUnit: 'MWh',
    downTimeRisk: 2,
    riskTimeframe: 'Next Week',
    carbonFootprint: 22.4,
  },
];

// Mock Forecasts
export const mockForecasts: Forecast[] = [
  {
    id: 'forecast-1',
    siteId: 'taj-sulfonation',
    assetName: 'Compressor',
    prediction: 'Bearing wear detected',
    severity: 'moderate',
    timeframe: '2-16 TeMl',
  },
  {
    id: 'forecast-2',
    siteId: 'taj-sulfonation',
    assetName: 'Pump A',
    prediction: 'Oil temperature rising',
    severity: 'low',
    timeframe: 'Caps Passor',
  },
  {
    id: 'forecast-3',
    siteId: 'taj-sulfonation',
    assetName: 'Furnace B',
    prediction: 'Vibration increase',
    severity: 'low',
    timeframe: 'vestit goodet o besine',
  },
  {
    id: 'forecast-4',
    siteId: 'plant-b',
    assetName: 'Pump A',
    prediction: 'Seal degradation',
    severity: 'moderate',
    timeframe: '2 days',
  },
  {
    id: 'forecast-5',
    siteId: 'plant-c',
    assetName: 'Compressor A',
    prediction: 'Pressure valve failure',
    severity: 'high',
    timeframe: '48 hours',
  },
];

// Solution Templates
export const solutionTemplates: SolutionTemplate[] = [
  {
    id: 'heavy-industry-operations',
    name: 'Heavy Industry – Operations Dashboard',
    description: 'Real-time monitoring for operators and maintenance teams. View SCADA data, asset health, active alarms, and predictive maintenance alerts for a single site.',
    role: 'operator',
    defaultView: 'single_site',
    category: 'heavy_industry',
    widgets: ['plant_health', 'active_alarms', 'critical_assets', 'forecast_summary', 'energy_consumption', 'downtime_risk', 'key_metrics'],
    icon: 'factory',
  },
  {
    id: 'heavy-industry-management',
    name: 'Heavy Industry – Management Dashboard',
    description: 'Executive overview across all sites. Aggregated KPIs, health scores, risk analysis, and sustainability metrics for plant managers and executives.',
    role: 'manager',
    defaultView: 'all_sites',
    category: 'heavy_industry',
    widgets: ['overview_kpi', 'asset_health_status', 'forecast_summary', 'carbon_footprint', 'trends_insights', 'plant_metrics'],
    icon: 'building',
  },
];

// Helper functions to get data by site
export const getAssetsBySite = (siteId: string): Asset[] => {
  if (siteId === 'all') return mockAssets;
  return mockAssets.filter(asset => asset.siteId === siteId);
};

export const getAlarmsBySite = (siteId: string): Alarm[] => {
  if (siteId === 'all') return mockAlarms;
  return mockAlarms.filter(alarm => alarm.siteId === siteId);
};

export const getKPIBySite = (siteId: string): SiteKPI | null => {
  if (siteId === 'all') {
    // Aggregate KPIs across all sites
    const aggregated: SiteKPI = {
      siteId: 'all',
      healthScore: Math.round(mockSiteKPIs.reduce((sum, kpi) => sum + kpi.healthScore, 0) / mockSiteKPIs.length),
      activeAlarms: {
        critical: mockSiteKPIs.reduce((sum, kpi) => sum + kpi.activeAlarms.critical, 0),
        warning: mockSiteKPIs.reduce((sum, kpi) => sum + kpi.activeAlarms.warning, 0),
        info: mockSiteKPIs.reduce((sum, kpi) => sum + kpi.activeAlarms.info, 0),
      },
      energyConsumption: parseFloat(mockSiteKPIs.reduce((sum, kpi) => sum + kpi.energyConsumption, 0).toFixed(1)),
      energyUnit: 'MWh',
      downTimeRisk: parseFloat((mockSiteKPIs.reduce((sum, kpi) => sum + kpi.downTimeRisk, 0) / mockSiteKPIs.length).toFixed(1)),
      riskTimeframe: 'Next Week',
      carbonFootprint: parseFloat(mockSiteKPIs.reduce((sum, kpi) => sum + kpi.carbonFootprint, 0).toFixed(1)),
    };
    return aggregated;
  }
  return mockSiteKPIs.find(kpi => kpi.siteId === siteId) || null;
};

export const getForecastsBySite = (siteId: string): Forecast[] => {
  if (siteId === 'all') return mockForecasts;
  return mockForecasts.filter(forecast => forecast.siteId === siteId);
};

export const getSiteById = (siteId: string): Site | null => {
  return mockSites.find(site => site.id === siteId) || null;
};
