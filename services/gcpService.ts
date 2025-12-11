
import { Tenant, SaaSPlan } from '../types';

// Feature Flag: Toggle this to true to switch from Direct Client API (Demo) to Cloud Proxy (SaaS Prod)
// In a real build pipeline, this would be set via REACT_APP_ENV='production'
export const IS_PRODUCTION_MODE = false; 

export const CLOUD_CONFIG = {
  projectId: 'practice-bridge-saas',
  region: 'us-central1',
  functionsEndpoint: 'https://us-central1-practice-bridge-saas.cloudfunctions.net',
  authDomain: 'practice-bridge-saas.firebaseapp.com'
};

// Mock Tenant Data for the Settings View
export const MOCK_TENANT: Tenant = {
  id: 'ORG-8842',
  name: 'Downtown Dental Group',
  plan: SaaSPlan.GROWTH,
  region: 'us-central1',
  usage: {
    aiTokens: 452000,
    storageGb: 4.2,
    activeUsers: 8
  },
  limits: {
    aiTokens: 1000000,
    storageGb: 10,
    activeUsers: 15
  }
};

/**
 * PRODUCTION PROXY
 * In a secure SaaS environment, we never expose the Gemini API Key in the frontend.
 * Instead, the frontend requests a signed JWT from Firebase Auth, and sends it to 
 * a Google Cloud Function. The Cloud Function holds the secret key and calls Vertex AI.
 */
export const callCloudFunction = async (endpoint: string, payload: any): Promise<any> => {
  if (!IS_PRODUCTION_MODE) {
    console.warn("Attempted to call Cloud Function in DEV mode. Use direct service mocks instead.");
    return null;
  }

  // 1. Get Auth Token (Simulated)
  const token = "mock-firebase-jwt-token"; 

  // 2. Call Cloud Function
  try {
    const response = await fetch(`${CLOUD_CONFIG.functionsEndpoint}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': MOCK_TENANT.id
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Cloud Function Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GCP Connection Failed:", error);
    throw error;
  }
};

/**
 * SAAS METRICS
 * Fetches current usage stats from BigQuery for the settings dashboard.
 */
export const getTenantUsage = async (): Promise<Tenant> => {
  // In prod, this would fetch from /api/usage
  return new Promise(resolve => setTimeout(() => resolve(MOCK_TENANT), 800));
};

export const upgradePlan = async (newPlan: SaaSPlan): Promise<boolean> => {
  // In prod, this would trigger a Stripe Checkout session via Cloud Functions
  console.log(`Upgrading tenant ${MOCK_TENANT.id} to ${newPlan}`);
  return true;
};
