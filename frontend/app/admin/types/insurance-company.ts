export interface InsuranceCompany {
  id?: number;
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  email: string;
  phone1: string;
  phone2?: string;
  website?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  industry: string;
  size: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";
  foundedYear: number;
  numberOfEmployees: number;
  annualRevenue?: string;
  contactPerson: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  financialInfo: {
    capital: string;
    turnover: string;
    rating: "A" | "AA" | "AAA" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C";
    solvencyRatio: string;
  };
  coverageTypes: string[];
  isActive: boolean;
}
