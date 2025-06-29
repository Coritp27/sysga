import { useState, useEffect } from "react";

export interface Dependent {
  id?: number;
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
}

export interface CreateDependentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  relation: string;
  nationalId?: string;
  insuredPersonId: number;
}

export interface UpdateDependentData extends CreateDependentData {
  id: number;
  isActive?: boolean;
}

export function useDependents(insuredPersonId?: number) {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les dépendants d'un assuré
  const loadDependents = async (personId: number) => {
    if (!personId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/dependents?insuredPersonId=${personId}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des dépendants");
      }

      const data = await response.json();
      setDependents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau dépendant
  const createDependent = async (
    dependentData: CreateDependentData
  ): Promise<Dependent> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dependents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dependentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création du dépendant"
        );
      }

      const newDependent = await response.json();

      // Mettre à jour la liste locale
      setDependents((prev) => [...prev, newDependent]);

      return newDependent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un dépendant
  const updateDependent = async (
    dependentData: UpdateDependentData
  ): Promise<Dependent> => {
    if (!dependentData.id) {
      throw new Error("ID du dépendant requis");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dependents/${dependentData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dependentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour du dépendant"
        );
      }

      const updatedDependent = await response.json();

      // Mettre à jour la liste locale
      setDependents((prev) =>
        prev.map((dep) =>
          dep.id === dependentData.id ? updatedDependent : dep
        )
      );

      return updatedDependent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un dépendant
  const deleteDependent = async (dependentId: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dependents/${dependentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression du dépendant"
        );
      }

      // Retirer de la liste locale
      setDependents((prev) => prev.filter((dep) => dep.id !== dependentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger automatiquement les dépendants quand insuredPersonId change
  useEffect(() => {
    if (insuredPersonId) {
      loadDependents(insuredPersonId);
    }
  }, [insuredPersonId]);

  return {
    dependents,
    loading,
    error,
    createDependent,
    updateDependent,
    deleteDependent,
    loadDependents,
  };
}
