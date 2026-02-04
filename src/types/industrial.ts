// Site / Plant types for multi-site industrial dashboard system

export interface Site {
  id: string;
  name: string;
  location: string;
  type: 'factory' | 'refinery' | 'plant' | 'unit';
  status: 'running' | 'maintenance' | 'stopped' | 'warning';
  healthScore: number;
}

export interface Asset {
  id: string;
  name: string;
  siteId: string;
  type: 'compressor' | 'pump' | 'furnace' | 'motor' | 'valve' | 'heat_exchanger';
  status: 'normal' | 'warning' | 'critical' | 'offline';
  predictedFailure: string | null;
  lastAnomaly: string | null;
  metrics: AssetMetric[];
}

export interface AssetMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface Alarm {
  id: string;
  siteId: string;
  assetId: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface SiteKPI {
  siteId: string;
  healthScore: number;
  activeAlarms: { critical: number; warning: number; info: number };
  energyConsumption: number;
  energyUnit: string;
  downTimeRisk: number;
  riskTimeframe: string;
  carbonFootprint: number;
}

export interface Forecast {
  id: string;
  siteId: string;
  assetName: string;
  prediction: string;
  severity: 'low' | 'moderate' | 'high';
  timeframe: string;
}

export interface SolutionTemplate {
  id: string;
  name: string;
  description: string;
  role: 'operator' | 'maintenance' | 'manager' | 'executive';
  defaultView: 'single_site' | 'all_sites';
  category: 'heavy_industry' | 'smart_building' | 'utilities' | 'logistics';
  widgets: string[];
  icon: string;
}

export type DashboardRole = 'operator' | 'maintenance' | 'manager' | 'executive';

export interface IndustrialDashboard {
  id: string;
  name: string;
  templateId: string;
  siteId: string | 'all'; // 'all' means all sites view
  role: DashboardRole;
  createdAt: string;
  widgets: IndustrialWidget[];
}

export interface IndustrialWidget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
}

export type WidgetType = 
  | 'plant_health'
  | 'active_alarms'
  | 'critical_assets'
  | 'forecast_summary'
  | 'energy_consumption'
  | 'downtime_risk'
  | 'key_metrics'
  | 'asset_health_status'
  | 'carbon_footprint'
  | 'trends_insights'
  | 'plant_metrics'
  | 'overview_kpi';
