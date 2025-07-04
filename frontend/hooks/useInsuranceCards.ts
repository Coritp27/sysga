import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface InsuranceCard {
  id: number;
  insuredPersonName: string;
  policyNumber: number;
  cardNumber: string;
  dateOfBirth: string;
  policyEffectiveDate: string;
  hadDependent: boolean;
  status: "ACTIVE" | "INACTIVE" | "REVOKED";
  validUntil: string;
  insuranceCompanyId: number;
  insuredPersonId: number;
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    cin: string;
    nif: string;
  };
  insuranceCompany: {
    id: number;
    name: string;
  };
  blockchainReference?: {
    id: number;
    reference: number;
    blockchainTxHash: string;
    createdAt: string;
  } | null;
}

interface CreateInsuranceCardData {
  insuredPersonId: number;
  cardNumber: string;
  policyNumber: string;
  dateOfBirth: string;
  policyEffectiveDate: string;
  hadDependent: boolean;
  numberOfDependent: number;
  status: "ACTIVE" | "INACTIVE" | "REVOKED";
  validUntil: string;
  blockchainReference?: number;
  blockchainTxHash?: string;
}

interface UpdateInsuranceCardData {
  id: number;
  status?: "ACTIVE" | "INACTIVE" | "REVOKED";
  validUntil?: string;
  hadDependent?: boolean;
  numberOfDependent?: number;
}

export interface UseInsuranceCardsReturn {
  cards: InsuranceCard[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useInsuranceCards = (): UseInsuranceCardsReturn => {
  const [cards, setCards] = useState<InsuranceCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/insurance-cards");

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setCards(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des cartes:", err);
      setError(err instanceof Error ? err : new Error("Erreur inconnue"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    isLoading,
    error,
    refetch: fetchCards,
  };
};

// Fonction pour créer une carte d'assurance
const createInsuranceCard = async (
  data: CreateInsuranceCardData
): Promise<InsuranceCard> => {
  const response = await fetch("/api/insurance-cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Erreur lors de la création de la carte d'assurance"
    );
  }

  return response.json();
};

// Fonction pour mettre à jour une carte d'assurance
const updateInsuranceCard = async (
  data: UpdateInsuranceCardData
): Promise<InsuranceCard> => {
  const response = await fetch("/api/insurance-cards", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Erreur lors de la mise à jour de la carte d'assurance"
    );
  }

  return response.json();
};

export const useCreateInsuranceCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInsuranceCard,
    onSuccess: () => {
      // Invalider et refetch les cartes d'assurance
      queryClient.invalidateQueries({ queryKey: ["insuranceCards"] });
    },
    onError: (error: Error) => {
      console.error(
        "Erreur lors de la création de la carte d'assurance:",
        error
      );
    },
  });
};

export const useUpdateInsuranceCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInsuranceCard,
    onSuccess: () => {
      // Invalider et refetch les cartes d'assurance
      queryClient.invalidateQueries({ queryKey: ["insuranceCards"] });
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la mise à jour de la carte d'assurance:",
        error
      );
    },
  });
};

// Hook pour les statistiques des cartes d'assurance
export const useInsuranceCardStats = () => {
  const { cards, isLoading, error } = useInsuranceCards();

  const stats = {
    total: 0,
    active: 0,
    inactive: 0,
    revoked: 0,
    withBlockchain: 0,
    newThisMonth: 0,
  };

  if (cards) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    stats.total = cards.length;
    stats.active = cards.filter(
      (card: InsuranceCard) => card.status === "ACTIVE"
    ).length;
    stats.inactive = cards.filter(
      (card: InsuranceCard) => card.status === "INACTIVE"
    ).length;
    stats.revoked = cards.filter(
      (card: InsuranceCard) => card.status === "REVOKED"
    ).length;
    stats.withBlockchain = cards.filter(
      (card: InsuranceCard) => card.blockchainReference !== null
    ).length;
    stats.newThisMonth = cards.filter((card: InsuranceCard) => {
      const cardDate = new Date(card.policyEffectiveDate);
      return (
        cardDate.getMonth() === currentMonth &&
        cardDate.getFullYear() === currentYear
      );
    }).length;
  }

  return {
    stats,
    isLoading,
    error,
  };
};
