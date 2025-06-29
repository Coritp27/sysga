export interface Enterprise {
  id?: number;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  website?: string;
  fiscalNumber: string;
  numberOfEmployees: number;
  insuranceCompanyId: number;
  createdAt?: string;
}
