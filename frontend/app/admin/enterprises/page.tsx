"use client";

import { useState, useEffect } from "react";
import { EnterpriseForm } from "../components/Forms/enterprise-form";
import { useWorkspace } from "../../../hooks/useWorkspace";

interface Enterprise {
  id: number;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  website?: string;
  fiscalNumber: string;
  numberOfEmployees: number;
  insuranceCompanyId: number;
}

export default function EnterprisesPage() {
  const { user, isLoading: userLoading } = useWorkspace();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnterprises = async () => {
    if (!user?.insuranceCompany?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/enterprises?insuranceCompanyId=${user.insuranceCompany.id}`
      );
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
    if (user?.insuranceCompany?.id) {
      fetchEnterprises();
    }
  }, [user?.insuranceCompany?.id]);

  const handleCreate = async (formData: any) => {
    if (!user?.insuranceCompany?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enterprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          insuranceCompanyId: user.insuranceCompany.id,
        }),
      });
      if (!res.ok)
        throw new Error("Erreur lors de la création de l'entreprise");
      await fetchEnterprises();
      setShowForm(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Entreprises de la compagnie</h1>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={() => setShowForm(true)}
        >
          Nouvelle entreprise
        </button>
      </div>
      {userLoading || loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Adresse</th>
              <th className="p-2">N° Fiscal</th>
              <th className="p-2">Employés</th>
            </tr>
          </thead>
          <tbody>
            {enterprises.map((ent) => (
              <tr key={ent.id} className="border-t">
                <td className="p-2">{ent.name}</td>
                <td className="p-2">{ent.email}</td>
                <td className="p-2">{ent.phone1}</td>
                <td className="p-2">{ent.address}</td>
                <td className="p-2">{ent.fiscalNumber}</td>
                <td className="p-2">{ent.numberOfEmployees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <EnterpriseForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          mode="create"
        />
      )}
    </div>
  );
}
