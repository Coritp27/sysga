import { useState, useEffect } from "react";

export interface Enterprise {
  id: number;
  name: string;
  email: string;
  phone1: string;
  address: string;
  fiscalNumber: string;
  numberOfEmployees: number;
}

export const useEnterprises = (insuranceCompanyId?: number) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnterprises = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = "/api/enterprises";
      if (insuranceCompanyId) {
        url += `?insuranceCompanyId=${insuranceCompanyId}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des entreprises");
      }
      const data = await response.json();
      setEnterprises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (insuranceCompanyId) {
      fetchEnterprises();
    }
  }, [insuranceCompanyId]);

  return {
    enterprises,
    loading,
    error,
    fetchEnterprises,
  };
};
