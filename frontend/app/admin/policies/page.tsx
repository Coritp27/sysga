"use client";

import { useState, useEffect } from "react";
import { AddIcon, SearchIcon } from "../assets/icons";
import { PolicyTable } from "../components/Tables/policy-table";
import { PolicyForm } from "../components/Forms/policy-form";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { Policy } from "../types/policy";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Fetch policies from API
  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/policies");
      if (!res.ok) throw new Error("Erreur lors du chargement des policies");
      const data = await res.json();
      setPolicies(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

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

  const handleSubmit = async (data: Policy) => {
    setLoading(true);
    setError(null);
    try {
      const method = formMode === "create" ? "POST" : "PUT";
      const url = formMode === "create" ? "/api/policies" : `/api/policies`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      await fetchPolicies();
      setIsFormOpen(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPolicy) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/policies?id=${selectedPolicy.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      await fetchPolicies();
      setIsDeleteModalOpen(false);
      setSelectedPolicy(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculs pour les statistiques
  const totalPolicies = policies.length;
  const activePolicies = policies.filter(
    (p) => new Date(p.validUntil) > new Date()
  ).length;
  const totalPremium = policies.reduce(
    (sum, p) => sum + (p.premiumAmount || 0),
    0
  );
  const expiringThisMonth = policies.filter((p) => {
    const endDate = new Date(p.validUntil);
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
