import { useState, useEffect } from "react";
import { useWorkspace } from "./useWorkspace";

export interface InsuredPerson {
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
  enterpriseId?: number;
  enterprise?: {
    id: number;
    name: string;
  };
  insuranceCards: {
    id: number;
    status: string;
  }[];
  dependents: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    relation: string;
    nationalId?: string;
    isActive: boolean;
    insuredPersonId: number;
    createdAt?: string;
    updatedAt?: string;
  }[];
}

export interface CreateInsuredPersonData {
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
  enterpriseId?: number;
}

export interface UpdateInsuredPersonData extends CreateInsuredPersonData {
  id: number;
}

export const useInsuredPersons = () => {
  const [insuredPersons, setInsuredPersons] = useState<InsuredPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les informations de l'utilisateur connecté
  const { user: workspaceUser, isLoading: workspaceLoading } = useWorkspace();

  // Récupérer tous les assurés
  const fetchInsuredPersons = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Filtrer par compagnie d'assurance si l'utilisateur en a une
      if (workspaceUser?.insuranceCompany?.id) {
        params.append(
          "insuranceCompanyId",
          workspaceUser.insuranceCompany.id.toString()
        );
      }

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/insured-persons?${params}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des assurés");
      }

      const data = await response.json();
      setInsuredPersons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel assuré
  const createInsuredPerson = async (
    data: CreateInsuredPersonData
  ): Promise<InsuredPerson> => {
    try {
      setError(null);
      const insuranceCompanyId = workspaceUser?.insuranceCompany?.id;
      const response = await fetch("/api/insured-persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, insuranceCompanyId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création de l'assuré"
        );
      }

      const newInsuredPerson = await response.json();

      // Mettre à jour la liste locale
      setInsuredPersons((prev) => [newInsuredPerson, ...prev]);

      return newInsuredPerson;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    }
  };

  // Mettre à jour un assuré
  const updateInsuredPerson = async (
    data: UpdateInsuredPersonData
  ): Promise<InsuredPerson> => {
    try {
      setError(null);

      const response = await fetch(`/api/insured-persons/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de l'assuré"
        );
      }

      const updatedInsuredPerson = await response.json();

      // Mettre à jour la liste locale
      setInsuredPersons((prev) =>
        prev.map((person) =>
          person.id === data.id ? updatedInsuredPerson : person
        )
      );

      return updatedInsuredPerson;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    }
  };

  // Supprimer un assuré
  const deleteInsuredPerson = async (id: number): Promise<void> => {
    try {
      setError(null);

      const response = await fetch(`/api/insured-persons/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression de l'assuré"
        );
      }

      // Mettre à jour la liste locale
      setInsuredPersons((prev) => prev.filter((person) => person.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    }
  };

  // Charger les données quand l'utilisateur est chargé
  useEffect(() => {
    if (!workspaceLoading) {
      fetchInsuredPersons();
    }
  }, [workspaceLoading, workspaceUser?.insuranceCompany?.id]);

  return {
    insuredPersons,
    loading: loading || workspaceLoading,
    error,
    fetchInsuredPersons,
    createInsuredPerson,
    updateInsuredPerson,
    deleteInsuredPerson,
    user: workspaceUser,
  };
};
