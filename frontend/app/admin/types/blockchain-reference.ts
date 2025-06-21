export interface BlockchainReference {
  id: number;
  referenceId: string;
  type: "POLICY" | "CARD" | "CLAIM" | "PAYMENT";
  status: "CONFIRMED" | "PENDING" | "FAILED";
  blockNumber: string;
  transactionHash: string;
  relatedEntity: {
    type: string;
    id: string;
    name: string;
  };
  createdAt: string;
  confirmedAt?: string;
  notes?: string;
}
