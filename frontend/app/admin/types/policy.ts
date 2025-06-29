export interface Policy {
  id?: number;
  policyNumber: number;
  type: "INDIVIDUAL" | "FAMILY" | "GROUP" | "ENTERPRISE";
  coverage: string;
  deductible: number;
  premiumAmount: number;
  description: string;
  validUntil: string;
  insuranceCompanyId: number;
  // Optionally keep frontend-only fields below, but mark as optional or comment out if not used by backend
  // status?: string;
  // startDate?: string;
  // endDate?: string;
  // insuredPerson?: any;
  // insuranceCompany?: any;
  // enterprise?: any;
  // coverageDetails?: any;
  // paymentInfo?: any;
  // documents?: any;
  // notes?: string;
  // createdAt?: string;
  // updatedAt?: string;
}
