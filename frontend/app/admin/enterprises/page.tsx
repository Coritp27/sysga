"use client";

import { useState, useEffect } from "react";
import { AddIcon, SearchIcon } from "../assets/icons";
import { EnterpriseForm } from "../components/Forms/enterprise-form";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { useWorkspace } from "../../../hooks/useWorkspace";
import type { Enterprise } from "../types/enterprise";

export default function EnterprisesPage() {
  const { user, isLoading: userLoading } = useWorkspace();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEnterprise, setSelectedEnterprise] =
    useState<Enterprise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Statistiques
  const totalEnterprises = enterprises.length;
  const totalEmployees = enterprises.reduce(
    (sum, e) => sum + (e.numberOfEmployees || 0),
    0
  );

  const fetchEnterprises = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/enterprises`);
      if (!res.ok) throw new Error("Erreur lors du chargement des entreprises");
      const data = await res.json();
      setEnterprises(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const handleCreate = () => {
    setFormMode("create");
    setSelectedEnterprise(null);
    setShowForm(true);
  };

  const handleEdit = (enterprise: Enterprise) => {
    setFormMode("edit");
    setSelectedEnterprise(enterprise);
    setShowForm(true);
  };

  const handleDelete = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: Enterprise) => {
    setLoading(true);
    setError(null);
    try {
      const method = formMode === "create" ? "POST" : "PUT";
      const url =
        formMode === "create"
          ? "/api/enterprises"
          : `/api/enterprises/${selectedEnterprise?.id}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      await fetchEnterprises();
      setShowForm(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedEnterprise) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/enterprises/${selectedEnterprise.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      await fetchEnterprises();
      setIsDeleteModalOpen(false);
      setSelectedEnterprise(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage par recherche
  const filteredEnterprises = enterprises.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.fiscalNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 font-satoshi">
      {/* Statistiques */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default">
          <p className="text-sm font-medium text-muted-foreground">
            Total Entreprises
          </p>
          <p className="text-2xl font-bold text-black">{totalEnterprises}</p>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default">
          <p className="text-sm font-medium text-muted-foreground">
            Total Employés
          </p>
          <p className="text-2xl font-bold text-black">{totalEmployees}</p>
        </div>
      </div>

      {/* Tableau + actions */}
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black">
            Liste des Entreprises
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              <AddIcon className="mr-2 h-4 w-4" />
              Nouvelle Entreprise
            </button>
          </div>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full table-auto border text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Nom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Téléphone</th>
                <th className="p-2">Adresse</th>
                <th className="p-2">N° Fiscal</th>
                <th className="p-2">Employés</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnterprises.map((ent) => (
                <tr key={ent.id} className="border-t">
                  <td className="p-2">{ent.name}</td>
                  <td className="p-2">{ent.email}</td>
                  <td className="p-2">{ent.phone1}</td>
                  <td className="p-2">{ent.address}</td>
                  <td className="p-2">{ent.fiscalNumber}</td>
                  <td className="p-2">{ent.numberOfEmployees}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEdit(ent)} title="Éditer">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(ent)} title="Supprimer">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Formulaire */}
      <EnterpriseForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        initialData={selectedEnterprise || undefined}
        mode={formMode}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'entreprise"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedEnterprise?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
