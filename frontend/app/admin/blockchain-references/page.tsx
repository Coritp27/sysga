"use client";

import { useState } from "react";
import { AddIcon, SearchIcon } from "../assets/icons";
import { BlockchainReferenceTable } from "../components/Tables/blockchain-reference-table";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { BlockchainReference } from "../types/blockchain-reference";
import { BlockchainReferenceForm } from "../components/Forms/blockchain-reference-form";

const initialReferences: BlockchainReference[] = [
  {
    id: 1,
    referenceId: "REF-2024-001",
    type: "POLICY",
    status: "CONFIRMED",
    blockNumber: "0x1234567890abcdef",
    transactionHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    relatedEntity: { type: "Police", id: "POL-2024-001", name: "Jean Dupont" },
    createdAt: "2024-01-15",
    confirmedAt: "2024-01-15",
    notes: "Exemple de référence blockchain.",
  },
  {
    id: 2,
    referenceId: "REF-2024-002",
    type: "CARD",
    status: "CONFIRMED",
    blockNumber: "0x1234567890abcdef",
    transactionHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    relatedEntity: { type: "Carte", id: "CARD-2024-001", name: "Marie Martin" },
    createdAt: "2024-02-15",
    confirmedAt: "2024-02-15",
    notes: "Carte blockchain.",
  },
  {
    id: 3,
    referenceId: "REF-2024-003",
    type: "CLAIM",
    status: "PENDING",
    blockNumber: "0xabcdef1234567890",
    transactionHash:
      "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    relatedEntity: {
      type: "Réclamation",
      id: "CLAIM-2024-001",
      name: "Pierre Durand",
    },
    createdAt: "2024-03-01",
    notes: "Réclamation en attente.",
  },
];

export default function BlockchainReferencesPage() {
  const [references, setReferences] =
    useState<BlockchainReference[]>(initialReferences);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReference, setSelectedReference] =
    useState<BlockchainReference | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const handleCreate = () => {
    setFormMode("create");
    setSelectedReference(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reference: BlockchainReference) => {
    setFormMode("edit");
    setSelectedReference(reference);
    setIsFormOpen(true);
  };

  const handleDelete = (reference: BlockchainReference) => {
    setSelectedReference(reference);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (data: BlockchainReference) => {
    if (formMode === "create") {
      const newReference = {
        ...data,
        id: Math.max(0, ...references.map((r) => r.id)) + 1,
      };
      setReferences([...references, newReference]);
    } else if (formMode === "edit" && selectedReference) {
      setReferences(
        references.map((r) =>
          r.id === selectedReference.id ? { ...data, id: r.id } : r
        )
      );
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedReference) {
      setReferences(references.filter((r) => r.id !== selectedReference.id));
      setIsDeleteModalOpen(false);
      setSelectedReference(null);
    }
  };

  const filteredReferences = references.filter((reference) => {
    return (
      reference.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reference.relatedEntity.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reference.relatedEntity.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reference.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Références Blockchain
        </h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <AddIcon className="mr-2 h-4 w-4" />
          Nouvelle Référence
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Références
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {references.length}
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Références Confirmées
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {references.filter((r) => r.status === "CONFIRMED").length}
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
                En Attente
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {references.filter((r) => r.status === "PENDING").length}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Échouées
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {references.filter((r) => r.status === "FAILED").length}
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Liste des Références Blockchain
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une référence..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <BlockchainReferenceTable
          references={filteredReferences}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <BlockchainReferenceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedReference || undefined}
        mode={formMode}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la Référence Blockchain"
        message="Êtes-vous sûr de vouloir supprimer cette référence blockchain ? Cette action est irréversible."
      />
    </div>
  );
}
