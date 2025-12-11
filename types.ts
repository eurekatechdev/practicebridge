
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PATIENT_DETAIL = 'PATIENT_DETAIL',
  INSURANCE_OCR = 'INSURANCE_OCR',
  ANALYTICS = 'ANALYTICS',
  LOGIN = 'LOGIN',
  SETTINGS = 'SETTINGS',
  TREATMENT_PRESENTER = 'TREATMENT_PRESENTER',
  WATCHDOG = 'WATCHDOG'
}

export enum UserRole {
  OWNER_DOCTOR = 'OWNER_DOCTOR',
  OFFICE_MANAGER = 'OFFICE_MANAGER',
  STAFF = 'STAFF'
}

export enum SaaSPlan {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE'
}

export interface Tenant {
  id: string;
  name: string;
  plan: SaaSPlan;
  region: string;
  usage: {
    aiTokens: number;
    storageGb: number;
    activeUsers: number;
  };
  limits: {
    aiTokens: number;
    storageGb: number;
    activeUsers: number;
  }
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  tenantId?: string; // Multi-tenancy support
}

export interface AuditLog {
  id: string;
  logDateTime: string;
  userNum: string;
  userName: string;
  userRole: UserRole;
  permType: 'PaymentEdit' | 'PaymentDelete' | 'Adjustment' | 'Other';
  logText: string;
  patNum: string;
  amount?: number;
}

export interface Anomaly {
  id: string;
  type: 'FRIDAY_DELETE' | 'GHOST_ADJUSTMENT' | 'BACKDATED_TX';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  detectedAt: string;
  relatedLogId: string;
  amount?: number;
}

export interface InsuranceDetails {
  memberId: string;
  groupNumber: string;
  payerName: string;
  planType: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  lastVisit: string;
  nextAppt?: string;
  insuranceStatus: 'Active' | 'Pending' | 'Expired';
  insuranceVerifiedDate?: string;
  remainingBenefits?: number;
  deductibleMet?: number;
  balance: number;
  noShowRiskScore: number;
  clinicalNotes: string;
  avatarUrl: string;
  tenantId?: string; // Multi-tenancy support
}

export interface ScriptContext {
  patientName: string;
  treatmentType: string;
  isBirthdayMonth: boolean;
  lastVisitDate: string;
  tone: 'Friendly' | 'Professional' | 'Urgent';
}

export interface ExtractedTreatment {
  treatmentName: string;
  status: 'Diagnosed' | 'Watch';
  confidence: number;
  snippet: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'patient' | 'practice' | 'system';
  timestamp: Date;
  analysis?: SentimentAnalysis;
}

export interface SentimentAnalysis {
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Complaint' | 'Urgent';
  intent: 'Booking' | 'Question' | 'Billing' | 'General';
  suggestedReply: string;
  requiresHumanReview: boolean;
}

export interface SmartFillCandidate {
  id: string;
  name: string;
  propensityScore: number;
  distanceMiles: number;
  lastVisit: string;
  reason: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  table: string;
  recordsSynced: number;
  status: 'Success' | 'Failed';
  durationMs: number;
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'message' | 'insight' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  diagnosis: string;
  toothNum: string;
  options: TreatmentTier[];
}

export interface TreatmentTier {
  id: string;
  tier: 'Good' | 'Better' | 'Best';
  name: string;
  description: string;
  price: number;
  patientCost: number;
  durability: number;
  aesthetics: number;
  timeRequired: string;
}

export interface ProviderPerformance {
  providerId: string;
  providerName: string;
  diagnosisConversion: number;
  productionPerHour: number;
  patientSatisfaction: number;
}
