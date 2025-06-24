import { useState, useEffect } from "react";
import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";

export interface BlockchainCard {
  id: bigint;
  cardNumber: string;
  issuedOn: bigint;
  status: string;
  insuranceCompany: string;
}

export interface UseBlockchainCardsReturn {
  cards: BlockchainCard[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isConnected: boolean;
}

export const useBlockchainCards = (): UseBlockchainCardsReturn => {
  const { address, isConnected } = useAccount();
  const [enabled, setEnabled] = useState(false);

  // Logs de débogage
  useEffect(() => {
    console.log("🔍 Debug useBlockchainCards:");
    console.log("- isConnected:", isConnected);
    console.log("- address:", address);
    console.log("- contractAddress:", contractAddress);
    console.log("- enabled:", enabled);
  }, [isConnected, address, enabled]);

  const {
    data: userCards,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getInsuranceCards",
    args: [address],
    query: {
      enabled: enabled && !!address,
    },
  });

  // Logs pour les données retournées
  useEffect(() => {
    if (userCards !== undefined) {
      console.log("📦 Données retournées par getInsuranceCards:", userCards);
      console.log("📦 Type de données:", typeof userCards);
      console.log(
        "📦 Longueur:",
        Array.isArray(userCards) ? userCards.length : "Non-array"
      );
    }
  }, [userCards]);

  // Logs pour les erreurs
  useEffect(() => {
    if (error) {
      console.error("❌ Erreur useReadContract:", error);
    }
  }, [error]);

  useEffect(() => {
    setEnabled(isConnected && !!address);
  }, [isConnected, address]);

  // Transformer les données en format attendu
  const cards: BlockchainCard[] = Array.isArray(userCards)
    ? userCards.map((card: any) => ({
        id: card.id,
        cardNumber: card.cardNumber,
        issuedOn: card.issuedOn,
        status: card.status,
        insuranceCompany: card.insuranceCompany,
      }))
    : [];

  return {
    cards,
    isLoading,
    error,
    refetch,
    isConnected,
  };
};
