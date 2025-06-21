export interface Policy {
  id?: number;
  policyNumber: string;
  type: "INDIVIDUAL" | "FAMILY" | "GROUP" | "ENTERPRISE";
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "PENDING" | "CANCELLED";
  startDate: string;
  endDate: string;
  premium: number;
  coverage: number;
  deductible?: number;
  coPay?: number;
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  insuranceCompany: {
    id: number;
    name: string;
  };
  enterprise?: {
    id: number;
    name: string;
  };
  coverageDetails: {
    type: string;
    description: string;
    limits: string;
    exclusions: string[];
  };
  paymentInfo: {
    frequency: "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "ANNUAL";
    method: "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "CHECK";
    nextPaymentDate: string;
    lastPaymentDate?: string;
  };
  documents: {
    policyDocument?: string;
    termsConditions?: string;
    additionalDocuments?: string[];
  };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
