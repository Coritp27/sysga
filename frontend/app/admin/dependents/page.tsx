"use client";

import { useState } from "react";
import { AddIcon, SearchIcon } from "../assets/icons";
import { DependentTable } from "../components/Tables/dependent-table";
import { DependentForm } from "../components/Forms/dependent-form";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { Dependent } from "../types/dependent";

export default function DependentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDependent, setSelectedDependent] = useState<Dependent | null>(
    null
  );
  const [dependents, setDependents] = useState<Dependent[]>([
    {
      id: 1,
      firstName: "Emma",
      lastName: "Dupont",
      dateOfBirth: "2015-03-15",
      relationship: "CHILD",
      status: "ACTIVE",
      insuredPerson: {
        id: 1,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
      },
      policyNumber: "POL-2024-001",
      insuranceCardNumber: "CARD-2024-001-01",
      createdAt: "2024-01-15",
      isActive: true,
    },
    {
      id: 2,
      firstName: "Sophie",
      lastName: "Martin",
      dateOfBirth: "1988-07-22",
      relationship: "SPOUSE",
      status: "ACTIVE",
      insuredPerson: {
        id: 2,
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@email.com",
      },
      policyNumber: "POL-2024-002",
      insuranceCardNumber: "CARD-2024-002-01",
      createdAt: "2024-02-15",
      isActive: true,
    },
    {
      id: 3,
      firstName: "Lucas",
      lastName: "Durand",
      dateOfBirth: "2018-11-08",
      relationship: "CHILD",
      status: "ACTIVE",
      insuredPerson: {
        id: 3,
        firstName: "Pierre",
        lastName: "Durand",
        email: "pierre.durand@email.com",
      },
      policyNumber: "POL-2024-003",
      insuranceCardNumber: "CARD-2024-003-01",
      createdAt: "2024-01-20",
      isActive: true,
    },
    {
      id: 4,
      firstName: "Claire",
      lastName: "Leroy",
      dateOfBirth: "1992-04-12",
      relationship: "SPOUSE",
      status: "INACTIVE",
      insuredPerson: {
        id: 4,
        firstName: "Sophie",
        lastName: "Leroy",
        email: "sophie.leroy@email.com",
      },
      policyNumber: "POL-2024-004",
      createdAt: "2023-12-10",
      isActive: false,
    },
    {
      id: 5,
      firstName: "Antoine",
      lastName: "Moreau",
      dateOfBirth: "2010-09-30",
      relationship: "CHILD",
      status: "ACTIVE",
      insuredPerson: {
        id: 5,
        firstName: "Lucas",
        lastName: "Moreau",
        email: "lucas.moreau@email.com",
      },
      policyNumber: "POL-2024-005",
      insuranceCardNumber: "CARD-2024-005-01",
      createdAt: "2024-01-25",
      isActive: true,
    },
  ]);

  const handleCreate = () => {
    setFormMode("create");
    setSelectedDependent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (dependent: Dependent) => {
    setFormMode("edit");
    setSelectedDependent(dependent);
    setIsFormOpen(true);
  };

  const handleDelete = (dependent: Dependent) => {
    setSelectedDependent(dependent);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (data: Dependent) => {
    if (formMode === "create") {
      const newDependent = {
        ...data,
        id: Math.max(...dependents.map((d) => d.id || 0)) + 1,
        createdAt: "2024-01-15",
      };
      setDependents([...dependents, newDependent]);
    } else {
      setDependents(
        dependents.map((d) =>
          d.id === selectedDependent?.id ? { ...data, id: d.id } : d
        )
      );
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedDependent?.id) {
      setDependents(dependents.filter((d) => d.id !== selectedDependent.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedDependent(null);
  };

  const filteredDependents = dependents.filter((dependent) => {
    return (
      dependent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dependent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dependent.insuredPerson.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dependent.insuredPerson.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dependent.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const childDependents = dependents.filter((d) => d.relationship === "CHILD");
  const spouseDependents = dependents.filter(
    (d) => d.relationship === "SPOUSE"
  );
  const otherDependents = dependents.filter(
    (d) => d.relationship === "OTHER" || d.relationship === "PARENT"
  );

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Dépendants
        </h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <AddIcon className="mr-2 h-4 w-4" />
          Nouveau Dépendant
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Dépendants
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {dependents.length}
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
                Enfants
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {childDependents.length}
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Conjoints
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {spouseDependents.length}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Autres
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {otherDependents.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600"
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
      </div>

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Liste des Dépendants
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un dépendant..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <DependentTable
          searchTerm={searchTerm}
          dependents={filteredDependents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Formulaire CRUD */}
      <DependentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedDependent || undefined}
        mode={formMode}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le dépendant"
        message={`Êtes-vous sûr de vouloir supprimer le dépendant "${selectedDependent?.firstName} ${selectedDependent?.lastName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
}
