import { useState, useEffect } from "react";
import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractAbi } from "@/constants/index";

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
  walletAddress: string | null;
}

export const useBlockchainCards = (): UseBlockchainCardsReturn => {
  const { address, isConnected } = useAccount();
  const [enabled, setEnabled] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log("🔍 Debug useBlockchainCards:");
    console.log("- isConnected:", isConnected);
    console.log("- walletAddress:", address);
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
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address,
    },
  });

  useEffect(() => {
    setEnabled(isConnected && !!address);
  }, [isConnected, address]);

  // Transform data
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
    walletAddress: address || null,
  };
};
