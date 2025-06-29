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
  isFirstUser?: boolean;
  message?: string;
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
      console.log("useWorkspace: Pas d'userId Clerk");
      setIsLoading(false);
      return;
    }

    console.log(
      `useWorkspace: Récupération de l'utilisateur pour userId: ${userId}`
    );

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (address) {
        params.append("walletAddress", address);
      }

      const url = `/api/user/workspace?${params}`;
      console.log(`useWorkspace: Appel API: ${url}`);

      const response = await fetch(url);

      console.log(`useWorkspace: Réponse API - Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `useWorkspace: Erreur API - ${response.status}: ${errorText}`
        );
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const userData = await response.json();
      console.log("useWorkspace: Données utilisateur reçues:", userData);

      setUser(userData);
    } catch (err) {
      console.error("useWorkspace: Erreur lors de la récupération:", err);
      setError(err instanceof Error ? err : new Error("Erreur inconnue"));
    } finally {
      setIsLoading(false);
    }
  };

  // Forcer la création de l'utilisateur si nécessaire
  const ensureUserExists = async () => {
    if (!userId) return;

    console.log(
      `useWorkspace: Vérification/création de l'utilisateur pour: ${userId}`
    );

    try {
      const response = await fetch("/api/user/workspace");
      if (response.ok) {
        const data = await response.json();
        console.log("useWorkspace: Utilisateur créé/récupéré:", data);
        setUser(data);
      } else {
        console.error("useWorkspace: Échec de création de l'utilisateur");
      }
    } catch (err) {
      console.error("useWorkspace: Erreur lors de la création:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log(`useWorkspace: useEffect - userId détecté: ${userId}`);
      fetchUser();
    } else {
      console.log("useWorkspace: useEffect - Pas d'userId");
      setIsLoading(false);
    }
  }, [userId, address]);

  // Effet de sécurité pour forcer la création si l'utilisateur n'existe pas
  useEffect(() => {
    if (userId && !user && !isLoading) {
      console.log(
        "useWorkspace: Utilisateur non trouvé, tentative de création..."
      );
      ensureUserExists();
    }
  }, [userId, user, isLoading]);

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
