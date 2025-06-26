"use client";

import { useAuth } from "@clerk/nextjs";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

export interface UserWorkspace {
  id: string;
  walletAddress: string | null;
  insuranceCompany: {
    id: number;
    name: string;
    email: string;
    phone1: string;
    phone2?: string;
    address: string;
    website?: string;
    fiscalNumber: string;
    numberOfEmployees: number;
    blockchainAddress?: string;
  } | null;
  role: {
    id: number;
    name: string;
    canRead: boolean;
    canWrite: boolean;
  };
}

export interface UseWorkspaceReturn {
  user: UserWorkspace | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useWorkspace = (): UseWorkspaceReturn => {
  const { userId } = useAuth();
  const { address } = useAccount();
  const [user, setUser] = useState<UserWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (address) {
        params.append("walletAddress", address);
      }

      const response = await fetch(`/api/user/workspace?${params}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur:", err);
      setError(err instanceof Error ? err : new Error("Erreur inconnue"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId, address]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
};

// Hook utilitaire pour filtrer les données par compagnie
export function useCompanyData<T>(data: T[]): T[] {
  const { user } = useWorkspace();

  if (!user?.insuranceCompany) {
    return data;
  }

  // Filtrer les données selon la compagnie de l'utilisateur
  return data.filter((item: any) => {
    return (
      item.insuranceCompanyId === user.insuranceCompany?.id ||
      item.companyId === user.insuranceCompany?.id
    );
  });
}
