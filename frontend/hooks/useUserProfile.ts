import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface UserProfile {
  id: number;
  username: string;
  userType: string;
  idClerk: string;
  walletAddress?: string;
  isActive: boolean;
  role: {
    id: number;
    name: string;
    canRead: boolean;
    canWrite: boolean;
    permission: string;
  };
  insuredPerson?: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    cin: string;
    nif: string;
    hasDependent: boolean;
    numberOfDependent: number;
    policyEffectiveDate: string;
  };
  insuranceCompany?: {
    id: number;
    name: string;
    email: string;
    phone1: string;
    address: string;
    website?: string;
    fiscalNumber: string;
    blockchainAddress?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/profile`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}
