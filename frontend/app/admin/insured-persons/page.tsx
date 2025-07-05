"use client";

import { useState } from "react";
import InsuredPersonTable from "../components/Tables/InsuredPersonTable";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { AddIcon, SearchIcon } from "../assets/icons";
import { InsuredPersonForm } from "../components/Forms/insured-person-form";
import { useInsuredPersons } from "../../../hooks/useInsuredPersons";
import {
  InsuredPerson,
  CreateInsuredPersonData,
  UpdateInsuredPersonData,
} from "../../../hooks/useInsuredPersons";
import { useEnterprises } from "../../../hooks/useEnterprises";
import { Dependent } from "../../../hooks/useDependents";

// Interface pour le formulaire (doit correspondre à celle du composant InsuredPersonForm)
interface FormInsuredPerson {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  city: string;
  postalCode: string;
  country: string;
  nationalId: string;
  passportNumber?: string;
  occupation: string;
  employer?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  isActive: boolean;
  dependents?: Dependent[];
}

const InsuredPersonsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingPerson, setEditingPerson] = useState<InsuredPerson | null>(
    null
  );
  const [deletingPerson, setDeletingPerson] = useState<InsuredPerson | null>(
    null
  );

  const {
    insuredPersons,
    loading,
    error,
    createInsuredPerson,
    updateInsuredPerson,
    deleteInsuredPerson,
    user,
  } = useInsuredPersons();
  const { enterprises } = useEnterprises(user?.insuranceCompany?.id);

  // Fonction pour sauvegarder les dépendants
  const saveDependents = async (
    insuredPersonId: number,
    dependents: Dependent[]
  ) => {
    try {
      // Récupérer les dépendants existants
      const existingDependentsResponse = await fetch(
        `/api/dependents?insuredPersonId=${insuredPersonId}`
      );
      const existingDependents: Dependent[] = existingDependentsResponse.ok
        ? await existingDependentsResponse.json()
        : [];

      // Créer des maps pour faciliter la comparaison
      const newMap = new Map(
        dependents.filter((dep) => dep.id).map((dep) => [dep.id, dep])
      );

      // Supprimer les dépendants qui ne sont plus dans la liste
      for (const existing of existingDependents) {
        if (!newMap.has(existing.id)) {
          await fetch(`/api/dependents/${existing.id}`, {
            method: "DELETE",
          });
        }
      }

      // Traiter chaque dépendant dans la nouvelle liste
      for (const dependent of dependents) {
        if (dependent.id) {
          // Dépendant existant - mettre à jour
          await fetch(`/api/dependents/${dependent.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...dependent,
              insuredPersonId: insuredPersonId,
            }),
          });
        } else {
          // Nouveau dépendant - créer
          await fetch("/api/dependents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...dependent,
              insuredPersonId: insuredPersonId,
            }),
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des dépendants:", error);
      throw error;
    }
  };

  // Fonction de transformation des données pour le formulaire
  const transformToFormData = (person: InsuredPerson): FormInsuredPerson => {
    return {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phone: person.phone,
      dateOfBirth: person.dateOfBirth,
      gender: person.gender as "MALE" | "FEMALE" | "OTHER",
      address: person.address,
      city: "", // À ajouter dans le schéma si nécessaire
      postalCode: "", // À ajouter dans le schéma si nécessaire
      country: "France", // Valeur par défaut
      nationalId: person.cin, // Utiliser CIN comme nationalId
      passportNumber: "",
      occupation: "", // À ajouter dans le schéma si nécessaire
      employer: person.enterprise?.name || "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      isActive: true,
      dependents:
        person.dependents?.map((dep) => ({
          id: dep.id,
          firstName: dep.firstName || "",
          lastName: dep.lastName || "",
          dateOfBirth: dep.dateOfBirth || "",
          gender: (dep.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
          relation: dep.relation || "",
          nationalId: dep.nationalId || "",
          isActive: dep.isActive ?? true,
          insuredPersonId: dep.insuredPersonId,
          createdAt: dep.createdAt,
          updatedAt: dep.updatedAt,
        })) || [],
    };
  };

  // Fonction de transformation des données du formulaire vers l'API
  const transformFromFormData = (
    formData: FormInsuredPerson
  ): CreateInsuredPersonData => {
    // Convertir employer en enterpriseId
    let enterpriseId: number | undefined;
    if (formData.employer && formData.employer.trim() !== "") {
      enterpriseId = Number(formData.employer);
    }

    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      gender: formData.gender,
      cin: formData.nationalId, // Utiliser nationalId comme CIN
      nif: formData.nationalId, // Utiliser nationalId comme NIF temporairement
      hasDependent:
        (formData.dependents && formData.dependents.length > 0) || false,
      numberOfDependent: formData.dependents?.length || 0,
      policyEffectiveDate: formData.dateOfBirth, // Utiliser dateOfBirth comme approximation
      enterpriseId: enterpriseId,
    };
  };

  const handleCreatePerson = async (formData: FormInsuredPerson) => {
    try {
      const apiData = transformFromFormData(formData);
      const newInsuredPerson = await createInsuredPerson(apiData);

      // Sauvegarder les dépendants si l'assuré a été créé avec succès
      if (
        newInsuredPerson &&
        formData.dependents &&
        formData.dependents.length > 0
      ) {
        await saveDependents(newInsuredPerson.id, formData.dependents);
      }

      closeForm();
      // Optionnel: Afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      // Optionnel: Afficher un message d'erreur
    }
  };

  const handleEditPerson = async (formData: FormInsuredPerson) => {
    try {
      if (!formData.id) return;

      const apiData = {
        ...transformFromFormData(formData),
        id: formData.id,
      } as UpdateInsuredPersonData;

      await updateInsuredPerson(apiData);

      // Sauvegarder les dépendants
      if (formData.dependents) {
        await saveDependents(formData.id, formData.dependents);
      }

      closeForm();
      // Optionnel: Afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      // Optionnel: Afficher un message d'erreur
    }
  };

  const handleDeletePerson = async (person: InsuredPerson) => {
    try {
      await deleteInsuredPerson(person.id);
      closeDeleteModal();
      // Optionnel: Afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      // Optionnel: Afficher un message d'erreur
    }
  };

  const handleFormSubmit = (formData: FormInsuredPerson) => {
    if (formMode === "create") {
      handleCreatePerson(formData);
    } else {
      handleEditPerson(formData);
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const openEditForm = (person: InsuredPerson) => {
    setFormMode("edit");
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const openDeleteModal = (person: InsuredPerson) => {
    setDeletingPerson(person);
    setIsDeleteModalOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPerson(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingPerson(null);
  };

  const confirmDelete = () => {
    if (deletingPerson) {
      handleDeletePerson(deletingPerson);
    }
  };

  // Calculer les statistiques
  const totalPersons = insuredPersons.length;
  const activePersons = insuredPersons.filter((person) =>
    person.insuranceCards.some((card) => card.status === "ACTIVE")
  ).length;
  const newThisMonth = insuredPersons.filter((person) => {
    const createdDate = new Date(person.dateOfBirth); // Utiliser dateOfBirth comme approximation
    const now = new Date();
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Ajout du log de debug avant le rendu du formulaire
  if (editingPerson) {
    console.log("editingPerson", editingPerson);
    console.log("dependents", editingPerson.dependents);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Personnes Assurées
            </h1>
            <p className="text-muted-foreground">
              Gérez toutes les personnes assurées dans le système
            </p>
          </div>
          <button
            onClick={openCreateForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <AddIcon className="mr-2 h-4 w-4" />
            <span>Nouvelle Personne</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Personnes
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {loading ? "..." : totalPersons.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Actives
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {loading ? "..." : activePersons.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nouvelles Ce Mois
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {loading ? "..." : newThisMonth.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  En Attente
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {loading
                    ? "..."
                    : (totalPersons - activePersons).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Liste des Personnes Assurées
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une personne..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <InsuredPersonTable
            insuredPersons={insuredPersons}
            loading={loading}
            searchTerm={searchTerm}
            onEdit={openEditForm}
            onDelete={openDeleteModal}
          />
        </div>

        {/* Modal de formulaire */}
        <InsuredPersonForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          initialData={
            editingPerson ? transformToFormData(editingPerson) : undefined
          }
          mode={formMode}
          enterprises={enterprises}
        />

        {/* Modal de confirmation de suppression */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer ${deletingPerson?.firstName} ${deletingPerson?.lastName} ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
        />
      </div>
    </>
  );
};

export default InsuredPersonsPage;
