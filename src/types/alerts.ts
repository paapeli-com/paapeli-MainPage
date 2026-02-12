// ============ Alert Engine Types ============

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'suppressed';
export type RuleType = 'threshold' | 'condition' | 'time_window' | 'device_state' | 'heartbeat' | 'anomaly' | 'cross_device';

export type ConditionOperator = '>' | '<' | '=' | '!=' | '>=' | '<=' | 'between' | 'change_rate';
export type LogicOperator = 'AND' | 'OR';

export interface AlertCondition {
  id: string;
  telemetryTag: string;
  operator: ConditionOperator;
  value: number;
  valueTo?: number; // for 'between'
  timeWindowMinutes?: number;
}

export interface ConditionGroup {
  id: string;
  logic: LogicOperator;
  conditions: AlertCondition[];
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  ruleType: RuleType;
  severity: AlertSeverity;
  enabled: boolean;
  // Scope
  deviceIds: string[];
  deviceType?: string;
  locationId?: string;
  gatewayId?: string;
  // Conditions
  conditionGroups: ConditionGroup[];
  // Escalation
  escalationPolicyId?: string;
  // Notification
  notificationChannelIds: string[];
  // Assignment
  assignedTeam?: string;
  assignedUserId?: string;
  // Meta
  createdAt: string;
  updatedAt: string;
  triggerCount: number;
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  deviceId: string;
  deviceName: string;
  locationId: string;
  locationName: string;
  relatedKPI?: string;
  triggerCondition: string;
  startTime: string;
  endTime?: string;
  duration: string;
  assignedTo?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notes: string[];
}

export interface EscalationLevel {
  level: number;
  role: string;
  delayMinutes: number;
  notificationChannelIds: string[];
}

export interface EscalationPolicy {
  id: string;
  name: string;
  description: string;
  levels: EscalationLevel[];
  slaMinutes: number;
  enabled: boolean;
  createdAt: string;
}

export type NotificationChannelType = 'email' | 'sms' | 'whatsapp' | 'webhook' | 'in_app' | 'mqtt';

export interface NotificationChannel {
  id: string;
  name: string;
  type: NotificationChannelType;
  config: Record<string, string>;
  enabled: boolean;
  createdAt: string;
}

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  ruleType: RuleType;
  severity: AlertSeverity;
  conditionGroups: ConditionGroup[];
  category: string;
  createdAt: string;
}

export interface AlertAnalyticsData {
  alertsBySeverity: { severity: AlertSeverity; count: number }[];
  alertsByLocation: { location: string; count: number }[];
  alertsOverTime: { date: string; critical: number; high: number; medium: number; low: number }[];
  mtta: number; // mean time to acknowledge (minutes)
  mttr: number; // mean time to resolve (minutes)
  topDevices: { device: string; count: number }[];
  topConditions: { condition: string; count: number }[];
}

// Wizard step types
export type AlertRuleWizardStep = 'scope' | 'conditions' | 'severity' | 'escalation' | 'notifications' | 'assignment';
