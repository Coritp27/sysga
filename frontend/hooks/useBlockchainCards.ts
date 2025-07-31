import { useState, useEffect } from "react";
import { useReadContract, useAccount, useChainId } from "wagmi";
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
  isChainSupported: boolean;
}

export const useBlockchainCards = (): UseBlockchainCardsReturn => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [enabled, setEnabled] = useState(false);

  // Vérifier si la chaîne est supportée (Sepolia = 11155111)
  const isChainSupported = chainId === 11155111;

  // Debug logs
  useEffect(() => {
    console.log("🔍 Debug useBlockchainCards:");
    console.log("- isConnected:", isConnected);
    console.log("- walletAddress:", address);
    console.log("- chainId:", chainId);
    console.log("- isChainSupported:", isChainSupported);
    console.log("- enabled:", enabled);
  }, [isConnected, address, chainId, isChainSupported, enabled]);

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
      enabled: enabled && !!address && isChainSupported,
    },
  });

  useEffect(() => {
    setEnabled(isConnected && !!address && isChainSupported);
  }, [isConnected, address, isChainSupported]);

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
    isChainSupported,
  };
};
