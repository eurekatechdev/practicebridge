

import { Patient, Metric, SmartFillCandidate, SyncLog, AppNotification, TreatmentPlan, User, UserRole, AuditLog, ProviderPerformance } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'U001',
    name: 'Dr. Aris (Owner)',
    email: 'aris@practice.com',
    role: UserRole.OWNER_DOCTOR,
    avatarUrl: 'https://ui-avatars.com/api/?name=Dr+Aris&background=0D8ABC&color=fff'
  },
  {
    id: 'U002',
    name: 'Sarah (Manager)',
    email: 'sarah@practice.com',
    role: UserRole.OFFICE_MANAGER,
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+M&background=EBF4FF&color=7F9CF5'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG001',
    logDateTime: '2023-12-08T16:45:00', // A Friday afternoon
    userNum: '102',
    userName: 'Receptionist Kelly',
    userRole: UserRole.STAFF,
    permType: 'PaymentDelete',
    logText: 'Deleted payment of $150.00 cash.',
    patNum: 'P004',
    amount: 150.00
  },
  {
    id: 'LOG002',
    logDateTime: '2023-12-06T10:30:00',
    userNum: '102',
    userName: 'Receptionist Kelly',
    userRole: UserRole.STAFF,
    permType: 'Adjustment',
    logText: 'Courtesy adjustment for "Service Satisfaction"',
    patNum: 'P002',
    amount: 450.00 // Suspiciously high for staff
  },
  {
    id: 'LOG003',
    logDateTime: '2023-12-05T09:15:00',
    userNum: '101',
    userName: 'Dr. Aris',
    userRole: UserRole.OWNER_DOCTOR,
    permType: 'PaymentEdit',
    logText: 'Corrected check number.',
    patNum: 'P001',
    amount: 0
  }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: 'Sarah Jenkins',
    dob: '1985-04-12',
    phone: '(555) 123-4567',
    email: 'sarah.j@example.com',
    lastVisit: '2023-11-15',
    nextAppt: '2023-12-10T14:00:00',
    insuranceStatus: 'Active',
    insuranceVerifiedDate: '2023-11-01',
    remainingBenefits: 1500.00,
    deductibleMet: 50.00,
    balance: 45.00,
    noShowRiskScore: 12,
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    clinicalNotes: 'S: Patient complains of cold sensitivity UR. \nO: #3 MO incipient decay. \nA: High caries risk. \nP: Watch #3, Rx Fluoride varnish.'
  },
  {
    id: 'P002',
    name: 'Michael Chen',
    dob: '1978-09-23',
    phone: '(555) 987-6543',
    email: 'm.chen@example.com',
    lastVisit: '2023-05-20',
    nextAppt: undefined,
    insuranceStatus: 'Expired',
    balance: 1200.00,
    noShowRiskScore: 85,
    avatarUrl: 'https://picsum.photos/id/91/200/200',
    clinicalNotes: 'Comprehensive exam completed. #19 has fractured cusp (mesio-buccal). Discussed crown vs onlay. Patient is hesitant due to cost. Nightguard recommended for bruxism.'
  },
  {
    id: 'P003',
    name: 'Emily Davis',
    dob: '1992-12-05',
    phone: '(555) 456-7890',
    email: 'emily.d@example.com',
    lastVisit: '2023-10-01',
    nextAppt: '2023-12-08T09:00:00',
    insuranceStatus: 'Pending',
    balance: 0.00,
    noShowRiskScore: 3,
    avatarUrl: 'https://picsum.photos/id/129/200/200',
    clinicalNotes: 'Routine prophylaxis. Hygiene excellent. No decay noted. Patient asked about whitening options.'
  },
  {
    id: 'P004',
    name: 'Robert Wilson',
    dob: '1960-02-14',
    phone: '(555) 222-3333',
    email: 'bob.wilson@example.com',
    lastVisit: '2022-12-10',
    nextAppt: undefined,
    insuranceStatus: 'Active',
    remainingBenefits: 250.00,
    insuranceVerifiedDate: '2022-12-01',
    balance: 0.00,
    noShowRiskScore: 65,
    avatarUrl: 'https://picsum.photos/id/177/200/200',
    clinicalNotes: 'Emergency exam. Patient presented with pain in LL quadrant. #18 shows periapical radiolucency. Endodontic treatment (Root Canal) indicated. Prescribed Amoxicillin.'
  }
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Total Revenue (Mo)', value: '$42,500', change: 12.5, trend: 'up' },
  { label: 'New Patients', value: 24, change: 8.2, trend: 'up' },
  { label: 'No-Show Rate', value: '4.2%', change: -1.5, trend: 'down' }, // Down is good for no-show
  { label: 'Unscheduled Tx', value: '$15,200', change: 5.4, trend: 'up' },
];

export const CHART_DATA_APPT = [
  { name: 'Mon', value: 24 },
  { name: 'Tue', value: 32 },
  { name: 'Wed', value: 28 },
  { name: 'Thu', value: 35 },
  { name: 'Fri', value: 18 },
  { name: 'Sat', value: 10 },
];

export const CHART_DATA_TX = [
  { name: 'Preventive', value: 45 },
  { name: 'Restorative', value: 30 },
  { name: 'Endo', value: 10 },
  { name: 'Ortho', value: 15 },
];

export const MOCK_SMART_FILL_CANDIDATES: SmartFillCandidate[] = [
  {
    id: 'SF1',
    name: 'Amanda Leary',
    propensityScore: 94,
    distanceMiles: 2.1,
    lastVisit: '2023-01-10',
    reason: 'Overdue Hygiene + Lives nearby'
  },
  {
    id: 'SF2',
    name: 'James O\'Connell',
    propensityScore: 88,
    distanceMiles: 5.4,
    lastVisit: '2023-04-22',
    reason: 'Proven fast-responder'
  },
  {
    id: 'SF3',
    name: 'Marcus Bell',
    propensityScore: 76,
    distanceMiles: 12.0,
    lastVisit: '2022-11-05',
    reason: 'Works near practice'
  }
];

export const MOCK_SYNC_LOGS: SyncLog[] = [
  { id: 'L1', timestamp: '2025-12-07T14:30:05', table: 'patient', recordsSynced: 12, status: 'Success', durationMs: 450 },
  { id: 'L2', timestamp: '2025-12-07T14:30:02', table: 'appointment', recordsSynced: 5, status: 'Success', durationMs: 120 },
  { id: 'L3', timestamp: '2025-12-07T14:15:00', table: 'procedurelog', recordsSynced: 128, status: 'Success', durationMs: 1100 },
  { id: 'L4', timestamp: '2025-12-07T14:00:00', table: 'auditlog', recordsSynced: 15, status: 'Success', durationMs: 850 },
  { id: 'L5', timestamp: '2025-12-07T13:45:12', table: 'claimproc', recordsSynced: 45, status: 'Failed', durationMs: 5000 },
  { id: 'L6', timestamp: '2025-12-07T13:30:01', table: 'recall', recordsSynced: 3, status: 'Success', durationMs: 210 },
];

export const MOCK_MINING_OPPORTUNITIES = [
  {
    id: 'M1',
    patientName: 'Sarah Jenkins',
    treatment: 'Scaling & Root Planing',
    snippet: '...Scaling and root planing needed in future visit due to 5mm pockets...',
    estRevenue: 1200,
    confidence: 92,
    dateIdentified: '2023-12-06'
  },
  {
    id: 'M2',
    patientName: 'Michael Chen',
    treatment: 'Crown #19',
    snippet: '...#19 has fractured cusp... Discussed crown vs onlay...',
    estRevenue: 1450,
    confidence: 98,
    dateIdentified: '2023-12-05'
  },
  {
    id: 'M3',
    patientName: 'Robert Wilson',
    treatment: 'Root Canal #18',
    snippet: '...#18 shows periapical radiolucency. Endodontic treatment indicated...',
    estRevenue: 1100,
    confidence: 99,
    dateIdentified: '2023-12-07'
  },
  {
    id: 'M4',
    patientName: 'Alice Cooper',
    treatment: 'Nightguard',
    snippet: '...evidence of bruxism on anteriors. Recommended NG...',
    estRevenue: 650,
    confidence: 85,
    dateIdentified: '2023-12-01'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N1',
    type: 'message',
    title: 'Sentiment Alert: Complaint',
    description: 'Patient P001 (Sarah Jenkins) expressed dissatisfaction with recent filling.',
    time: '2 mins ago',
    read: false,
    actionLabel: 'Review Chat'
  },
  {
    id: 'N2',
    type: 'insight',
    title: 'High Value Opportunity',
    description: 'Mining identified $1,450 unscheduled treatment for Michael Chen.',
    time: '1 hour ago',
    read: false,
    actionLabel: 'View Report'
  },
  {
    id: 'N3',
    type: 'system',
    title: 'Sync Failed: claimproc',
    description: 'Edge Agent failed to sync claimproc table. Retrying in 5 min.',
    time: '2 hours ago',
    read: true,
    actionLabel: 'Check Agent'
  }
];

export const MOCK_TREATMENT_PLANS: Record<string, TreatmentPlan> = {
  'P002': {
    id: 'TX001',
    patientId: 'P002',
    diagnosis: 'Fractured Molar (Mesio-Buccal Cusp)',
    toothNum: '19',
    options: [
      {
        id: 'OPT1',
        tier: 'Good',
        name: 'Large Amalgam Filling',
        description: 'Functional silver filling. Lowest cost, but relies on remaining tooth structure which is weak.',
        price: 250,
        patientCost: 50, // Insurance covers 80%
        durability: 5,
        aesthetics: 2,
        timeRequired: '45 mins'
      },
      {
        id: 'OPT2',
        tier: 'Better',
        name: 'Gold Onlay',
        description: 'Gold restoration. Extremely durable, requires less tooth removal than a crown. Gold color.',
        price: 950,
        patientCost: 475, // Insurance covers 50%
        durability: 10,
        aesthetics: 4,
        timeRequired: '2 visits'
      },
      {
        id: 'OPT3',
        tier: 'Best',
        name: 'Zirconia Ceramic Crown',
        description: 'Tooth-colored, high-strength ceramic. Wraps the whole tooth to prevent splitting. Natural look.',
        price: 1450,
        patientCost: 725, // Insurance covers 50%
        durability: 9,
        aesthetics: 10,
        timeRequired: '2 visits'
      }
    ]
  }
};

export const MOCK_PROVIDER_PERFORMANCE: ProviderPerformance[] = [
  { 
    providerId: 'U001', 
    providerName: 'Dr. Aris (Owner)', 
    diagnosisConversion: 78, 
    productionPerHour: 850, 
    patientSatisfaction: 4.9 
  },
  { 
    providerId: 'U004', 
    providerName: 'Dr. Sarah (Associate)', 
    diagnosisConversion: 42, 
    productionPerHour: 480, 
    patientSatisfaction: 4.8 
  }
];