"use client";

import { useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import InsuredPersonTable from "../components/Tables/InsuredPersonTable";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { AddIcon, SearchIcon } from "../assets/icons";
import { InsuredPersonForm } from "../components/Forms/insured-person-form";

const InsuredPersonsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingPerson, setEditingPerson] = useState<any>(null);
  const [deletingPerson, setDeletingPerson] = useState<any>(null);

  const handleCreatePerson = (data: any) => {
    console.log("Créer une nouvelle personne assurée:", data);
    // Ici on ajouterait l'appel API pour créer la personne
    // Pour l'instant, on affiche juste dans la console
  };

  const handleEditPerson = (data: any) => {
    console.log("Modifier la personne assurée:", data);
    // Ici on ajouterait l'appel API pour modifier la personne
    // Pour l'instant, on affiche juste dans la console
  };

  const handleDeletePerson = (person: any) => {
    console.log("Supprimer la personne assurée:", person);
    // Ici on ajouterait l'appel API pour supprimer la personne
    // Pour l'instant, on affiche juste dans la console
  };

  const handleFormSubmit = (data: any) => {
    if (formMode === "create") {
      handleCreatePerson(data);
    } else {
      handleEditPerson(data);
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const openEditForm = (person: any) => {
    setFormMode("edit");
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const openDeleteModal = (person: any) => {
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

  return (
    <>
      <Breadcrumb pageName="Personnes Assurées" />

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
                  2,847
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
                  2,654
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
                  89
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
                  104
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
          initialData={editingPerson}
          mode={formMode}
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
