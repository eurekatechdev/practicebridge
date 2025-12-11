
import { AuditLog, Anomaly, UserRole } from '../types';

export const detectAnomalies = (logs: AuditLog[]): Anomaly[] => {
  const anomalies: Anomaly[] = [];

  logs.forEach(log => {
    // 1. Detect "Friday Deletes"
    // Logic: PermType = PaymentDelete AND Day of Week = Friday (6 in JS getDay where Sun=0, but ISO might differ, assuming typical date parsing)
    // Here we parse ISO string.
    const logDate = new Date(log.logDateTime);
    const dayOfWeek = logDate.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
    
    // Check for Friday (5) after 12:00 PM
    if (log.permType === 'PaymentDelete' && dayOfWeek === 5 && logDate.getHours() >= 12) {
      anomalies.push({
        id: `AN-${log.id}`,
        type: 'FRIDAY_DELETE',
        severity: 'HIGH',
        title: 'Suspicious Deletion (Friday)',
        description: `User ${log.userName} deleted a payment of $${log.amount} on a Friday afternoon. This is a common pattern for embezzlement.`,
        detectedAt: new Date().toISOString(),
        relatedLogId: log.id,
        amount: log.amount
      });
    }

    // 2. Detect "Ghost Adjustments"
    // Logic: Adjustment > $200 AND User != OWNER_DOCTOR
    if (log.permType === 'Adjustment' && (log.amount || 0) > 200 && log.userRole !== UserRole.OWNER_DOCTOR) {
      anomalies.push({
        id: `AN-${log.id}`,
        type: 'GHOST_ADJUSTMENT',
        severity: 'MEDIUM',
        title: 'High-Value Adjustment by Staff',
        description: `User ${log.userName} (${log.userRole}) performed an adjustment of $${log.amount}. Adjustments over $200 should typically be approved by an Owner.`,
        detectedAt: new Date().toISOString(),
        relatedLogId: log.id,
        amount: log.amount
      });
    }
  });

  return anomalies;
};
