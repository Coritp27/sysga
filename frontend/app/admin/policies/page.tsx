"use client";

import { useState } from "react";
import { AddIcon, SearchIcon } from "../assets/icons";
import { PolicyTable } from "../components/Tables/policy-table";
import { PolicyForm } from "../components/Forms/policy-form";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { Policy } from "../types/policy";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 1,
      policyNumber: "POL-2024-001",
      type: "INDIVIDUAL",
      status: "ACTIVE",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      premium: 1200,
      coverage: 50000,
      deductible: 500,
      coPay: 20,
      insuredPerson: {
        id: 1,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "01 23 45 67 89",
      },
      insuranceCompany: {
        id: 1,
        name: "AXA Assurance",
      },
      coverageDetails: {
        type: "Couverture complète santé",
        description:
          "Couverture médicale complète incluant consultations, hospitalisation et médicaments",
        limits: "50,000 € par an",
        exclusions: ["Maladies préexistantes", "Traitements cosmétiques"],
      },
      paymentInfo: {
        frequency: "MONTHLY",
        method: "BANK_TRANSFER",
        nextPaymentDate: "2024-02-01",
        lastPaymentDate: "2024-01-01",
      },
      documents: {
        policyDocument: "POL-2024-001.pdf",
        termsConditions: "terms-2024.pdf",
        additionalDocuments: [],
      },
      notes: "Police standard pour un employé",
      createdAt: "2023-12-15",
    },
    {
      id: 2,
      policyNumber: "POL-2024-002",
      type: "FAMILY",
      status: "ACTIVE",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      premium: 2400,
      coverage: 100000,
      deductible: 1000,
      coPay: 15,
      insuredPerson: {
        id: 2,
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@email.com",
        phone: "01 98 76 54 32",
      },
      insuranceCompany: {
        id: 2,
        name: "Allianz France",
      },
      coverageDetails: {
        type: "Couverture familiale santé",
        description:
          "Couverture pour toute la famille avec soins dentaires et optiques",
        limits: "100,000 € par an",
        exclusions: ["Médecine alternative", "Soins dentaires"],
      },
      paymentInfo: {
        frequency: "QUARTERLY",
        method: "CREDIT_CARD",
        nextPaymentDate: "2024-04-01",
        lastPaymentDate: "2024-01-01",
      },
      documents: {
        policyDocument: "POL-2024-002.pdf",
        termsConditions: "terms-family-2024.pdf",
        additionalDocuments: [],
      },
      notes: "Police familiale premium",
      createdAt: "2023-12-20",
    },
    {
      id: 3,
      policyNumber: "POL-2024-003",
      type: "ENTERPRISE",
      status: "ACTIVE",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      premium: 15000,
      coverage: 500000,
      deductible: 5000,
      coPay: 10,
      insuredPerson: {
        id: 3,
        firstName: "Pierre",
        lastName: "Durand",
        email: "pierre.durand@entreprise.com",
        phone: "01 45 67 89 12",
      },
      insuranceCompany: {
        id: 3,
        name: "Groupama",
      },
      enterprise: {
        id: 1,
        name: "TechCorp Solutions",
      },
      coverageDetails: {
        type: "Couverture entreprise complète",
        description: "Couverture pour tous les employés de l'entreprise",
        limits: "500,000 € par an",
        exclusions: ["Accidents de travail", "Maladies professionnelles"],
      },
      paymentInfo: {
        frequency: "ANNUAL",
        method: "BANK_TRANSFER",
        nextPaymentDate: "2025-01-01",
        lastPaymentDate: "2024-01-01",
      },
      documents: {
        policyDocument: "POL-2024-003.pdf",
        termsConditions: "terms-enterprise-2024.pdf",
        additionalDocuments: [],
      },
      notes: "Police d'entreprise pour TechCorp",
      createdAt: "2023-11-30",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const handleCreate = () => {
    setFormMode("create");
    setSelectedPolicy(null);
    setIsFormOpen(true);
  };

  const handleEdit = (policy: Policy) => {
    setFormMode("edit");
    setSelectedPolicy(policy);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const policy = policies.find((p) => p.id === id);
    if (policy) {
      setSelectedPolicy(policy);
      setIsDeleteModalOpen(true);
    }
  };

  const handleSubmit = (data: Policy) => {
    if (formMode === "create") {
      const newPolicy = {
        ...data,
        id: Math.max(...policies.map((p) => p.id || 0)) + 1,
      };
      setPolicies([...policies, newPolicy]);
    } else {
      setPolicies(
        policies.map((policy) =>
          policy.id === selectedPolicy?.id ? { ...data, id: policy.id } : policy
        )
      );
    }
  };

  const confirmDelete = () => {
    if (selectedPolicy?.id) {
      setPolicies(policies.filter((policy) => policy.id !== selectedPolicy.id));
      setIsDeleteModalOpen(false);
      setSelectedPolicy(null);
    }
  };

  // Calculs pour les statistiques
  const totalPolicies = policies.length;
  const activePolicies = policies.filter((p) => p.status === "ACTIVE").length;
  const totalPremium = policies.reduce((sum, p) => sum + p.premium, 0);
  const expiringThisMonth = policies.filter((p) => {
    const endDate = new Date(p.endDate);
    const now = new Date();
    return (
      endDate.getMonth() === now.getMonth() &&
      endDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Polices d'Assurance
        </h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <AddIcon className="mr-2 h-4 w-4" />
          Nouvelle Police
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Polices
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {totalPolicies}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Polices Actives
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {activePolicies}
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
                Montant Total
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  notation: "compact",
                }).format(totalPremium)}
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Expirant Ce Mois
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {expiringThisMonth}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-orange-600"
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
            Liste des Polices d'Assurance
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une police..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <PolicyTable
          policies={policies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchTerm={searchTerm}
        />
      </div>

      {/* Formulaire modal */}
      <PolicyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedPolicy || undefined}
        mode={formMode}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la police"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedPolicy?.policyNumber}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
