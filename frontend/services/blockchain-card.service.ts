import { BlockchainCard } from "@/hooks/useBlockchainCards";

export interface FormattedCard {
  id: string;
  cardNumber: string;
  insuredPersonName: string;
  insuredPersonEmail: string;
  policyNumber: string;
  policyEffectiveDate: string;
  expiryDate: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "SUSPENDED";
  insuranceCompany: string;
  enterprise?: string;
}

// Mapping des statuts blockchain vers l'interface
const statusMapping: Record<
  string,
  "ACTIVE" | "INACTIVE" | "EXPIRED" | "SUSPENDED"
> = {
  active: "ACTIVE",
  inactive: "INACTIVE",
  expired: "EXPIRED",
  suspended: "SUSPENDED",
};

// Mapping des adresses de compagnies d'assurance (en production, ceci viendrait de la DB)
const companyMapping: Record<string, string> = {
  "0x1234567890123456789012345678901234567890": "AXA Assurance",
  "0x2345678901234567890123456789012345678901": "Allianz France",
  "0x3456789012345678901234567890123456789012": "Groupama",
  "0x4567890123456789012345678901234567890123": "MAIF",
  "0x5678901234567890123456789012345678901234": "MACIF",
};

export const transformBlockchainCard = (
  blockchainCard: BlockchainCard
): FormattedCard => {
  const issuedDate = new Date(Number(blockchainCard.issuedOn) * 1000);
  const expiryDate = new Date(issuedDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Expire dans 1 an par défaut

  return {
    id: blockchainCard.id.toString(),
    cardNumber: blockchainCard.cardNumber,
    insuredPersonName: `Assuré ${blockchainCard.id}`, // En production, ceci viendrait de la DB
    insuredPersonEmail: `assure${blockchainCard.id}@example.com`, // En production, ceci viendrait de la DB
    policyNumber: `POL-${blockchainCard.id.toString().padStart(6, "0")}`,
    policyEffectiveDate: issuedDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    status: statusMapping[blockchainCard.status.toLowerCase()] || "ACTIVE",
    insuranceCompany:
      companyMapping[blockchainCard.insuranceCompany] ||
      blockchainCard.insuranceCompany,
    enterprise: undefined, // En production, ceci viendrait de la DB
  };
};

export const transformBlockchainCards = (
  blockchainCards: BlockchainCard[]
): FormattedCard[] => {
  return blockchainCards.map(transformBlockchainCard);
};
