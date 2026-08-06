export type Role = "viewer" | "approver" | "admin";

export type KycStatus = "pending" | "in_review" | "approved" | "rejected" | "escalated";
export type RiskLevel = "low" | "medium" | "high";

export interface KycCase {
  id: string;
  customerName: string;
  customerEmail: string;
  country: string;
  documentType: string;
  riskLevel: RiskLevel;
  status: KycStatus;
  submittedAt: string;
  notes: string;
}

export type RefundStatus = "requested" | "approved" | "rejected" | "processed";

export interface Refund {
  id: string;
  customerName: string;
  orderId: string;
  amount: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
}

export type FlagEnvironment = "development" | "staging" | "production";

export interface FeatureFlag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  environment: FlagEnvironment;
  rolloutPercent: number;
  owner: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  app: "kyc" | "refunds" | "flags";
  action: string;
  entityId: string;
  before: string | null;
  after: string | null;
}
