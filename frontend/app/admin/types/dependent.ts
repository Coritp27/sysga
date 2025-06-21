export interface Dependent {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: "CHILD" | "SPOUSE" | "PARENT" | "OTHER";
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  policyNumber: string;
  insuranceCardNumber?: string;
  additionalInfo?: {
    notes?: string;
    specialConditions?: string;
    medicalHistory?: string;
  };
  isActive: boolean;
  createdAt?: string;
}
