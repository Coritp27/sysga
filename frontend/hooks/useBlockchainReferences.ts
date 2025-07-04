import { useState, useEffect } from "react";

interface BlockchainReference {
  id: number;
  reference: number;
  cardNumber: string;
  blockchainTxHash: string;
  createdAt: string;
  card?: {
    id: number;
    cardNumber: string;
    insuredPersonName: string;
    policyNumber: number;
    status: string;
    insuredPerson: {
      firstName: string;
      lastName: string;
      email: string;
      cin: string;
      nif: string;
    };
    insuranceCompany: {
      name: string;
    };
  };
}

export function useBlockchainReferences() {
  const [references, setReferences] = useState<BlockchainReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferences = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/blockchain-references");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setReferences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  return {
    references,
    loading,
    error,
    refetch: fetchReferences,
  };
}
