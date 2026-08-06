import { AuditEntry, FeatureFlag, KycCase, Refund, Role } from "./types";

interface Store {
  kycCases: KycCase[];
  refunds: Refund[];
  flags: FeatureFlag[];
  audit: AuditEntry[];
  counter: number;
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function seed(): Store {
  return {
    kycCases: [
      { id: "KYC-1001", customerName: "Amara Okafor", customerEmail: "amara.okafor@example.com", country: "NG", documentType: "Passport", riskLevel: "high", status: "pending", submittedAt: daysAgo(1), notes: "PEP screening flagged a partial name match." },
      { id: "KYC-1002", customerName: "Lucas Meyer", customerEmail: "lucas.meyer@example.com", country: "DE", documentType: "National ID", riskLevel: "low", status: "pending", submittedAt: daysAgo(2), notes: "" },
      { id: "KYC-1003", customerName: "Sofia Ribeiro", customerEmail: "sofia.ribeiro@example.com", country: "BR", documentType: "Driver License", riskLevel: "medium", status: "in_review", submittedAt: daysAgo(3), notes: "Address proof is older than 90 days." },
      { id: "KYC-1004", customerName: "James Chen", customerEmail: "james.chen@example.com", country: "US", documentType: "Passport", riskLevel: "low", status: "approved", submittedAt: daysAgo(6), notes: "" },
      { id: "KYC-1005", customerName: "Fatima Al-Rashid", customerEmail: "fatima.rashid@example.com", country: "AE", documentType: "Emirates ID", riskLevel: "medium", status: "pending", submittedAt: daysAgo(0), notes: "" },
      { id: "KYC-1006", customerName: "Viktor Petrov", customerEmail: "viktor.petrov@example.com", country: "BG", documentType: "Passport", riskLevel: "high", status: "escalated", submittedAt: daysAgo(4), notes: "Sanctions list near-match; escalated to compliance lead." },
      { id: "KYC-1007", customerName: "Emma Johansson", customerEmail: "emma.johansson@example.com", country: "SE", documentType: "National ID", riskLevel: "low", status: "rejected", submittedAt: daysAgo(8), notes: "Document image illegible after two resubmissions." },
    ],
    refunds: [
      { id: "REF-2001", customerName: "Amara Okafor", orderId: "ORD-88123", amount: 249.99, currency: "USD", reason: "Duplicate charge", status: "requested", requestedAt: daysAgo(0) },
      { id: "REF-2002", customerName: "Lucas Meyer", orderId: "ORD-88097", amount: 1200.0, currency: "EUR", reason: "Service not delivered", status: "requested", requestedAt: daysAgo(1) },
      { id: "REF-2003", customerName: "Sofia Ribeiro", orderId: "ORD-87911", amount: 35.5, currency: "BRL", reason: "Accidental purchase", status: "approved", requestedAt: daysAgo(2) },
      { id: "REF-2004", customerName: "James Chen", orderId: "ORD-87500", amount: 89.0, currency: "USD", reason: "Fraudulent transaction", status: "processed", requestedAt: daysAgo(5) },
      { id: "REF-2005", customerName: "Fatima Al-Rashid", orderId: "ORD-87322", amount: 560.75, currency: "AED", reason: "Wrong amount charged", status: "rejected", requestedAt: daysAgo(6) },
      { id: "REF-2006", customerName: "Viktor Petrov", orderId: "ORD-87119", amount: 15.0, currency: "USD", reason: "Subscription cancelled", status: "requested", requestedAt: daysAgo(3) },
    ],
    flags: [
      { id: "FLG-3001", key: "instant-payouts", description: "Enable instant payout rail for verified merchants", enabled: true, environment: "production", rolloutPercent: 25, owner: "payments-team", updatedAt: daysAgo(2) },
      { id: "FLG-3002", key: "new-onboarding-flow", description: "Redesigned KYC onboarding wizard", enabled: true, environment: "staging", rolloutPercent: 100, owner: "growth-team", updatedAt: daysAgo(1) },
      { id: "FLG-3003", key: "risk-model-v3", description: "Third-generation transaction risk scoring model", enabled: false, environment: "production", rolloutPercent: 0, owner: "risk-team", updatedAt: daysAgo(7) },
      { id: "FLG-3004", key: "dark-mode", description: "Dark mode for the customer dashboard", enabled: true, environment: "development", rolloutPercent: 100, owner: "frontend-team", updatedAt: daysAgo(10) },
      { id: "FLG-3005", key: "chargeback-auto-response", description: "Automated evidence submission for chargebacks", enabled: false, environment: "staging", rolloutPercent: 50, owner: "payments-team", updatedAt: daysAgo(4) },
    ],
    audit: [],
    counter: 4000,
  };
}

const globalStore = globalThis as unknown as { __appStore?: Store };

export function getStore(): Store {
  if (!globalStore.__appStore) {
    globalStore.__appStore = seed();
  }
  return globalStore.__appStore;
}

export function recordAudit(
  entry: Omit<AuditEntry, "id" | "timestamp">
): AuditEntry {
  const store = getStore();
  store.counter += 1;
  const full: AuditEntry = {
    ...entry,
    id: `AUD-${store.counter}`,
    timestamp: new Date().toISOString(),
  };
  store.audit.unshift(full);
  return full;
}

export const ROLE_ACTOR: Record<Role, string> = {
  viewer: "casey.viewer@fintech.example",
  approver: "alex.approver@fintech.example",
  admin: "ada.admin@fintech.example",
};
