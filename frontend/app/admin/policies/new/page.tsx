"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "../../assets/icons";
import Link from "next/link";

interface PolicyFormData {
  policyNumber: string;
  type: "INDIVIDUAL" | "FAMILY";
  coverage: string;
  deductible: number;
  premiumAmount: number;
  description: string;
  validUntil: string;
  insuranceCompanyId: number;
}

export default function NewPolicyPage() {
  const [formData, setFormData] = useState<PolicyFormData>({
    policyNumber: "",
    type: "INDIVIDUAL",
    coverage: "",
    deductible: 0,
    premiumAmount: 0,
    description: "",
    validUntil: "",
    insuranceCompanyId: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Données statiques pour les compagnies d'assurance
  const insuranceCompanies = [
    { id: 1, name: "AXA Assurance" },
    { id: 2, name: "Allianz" },
    { id: 3, name: "CNP Assurances" },
    { id: 4, name: "Groupama" },
    { id: 5, name: "MAIF" },
    { id: 6, name: "MACIF" },
    { id: 7, name: "MMA" },
    { id: 8, name: "GMF" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "deductible" ||
        name === "premiumAmount" ||
        name === "insuranceCompanyId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Ici on ajouterait la logique pour sauvegarder en base de données
      console.log("Politique créée:", formData);

      // Redirection vers la liste des politiques
      window.location.href = "/admin/policies";
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/policies"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour aux politiques
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Nouvelle Politique d'Assurance
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Créez une nouvelle politique d'assurance en remplissant les
          informations ci-dessous.
        </p>
      </div>

      {/* Formulaire */}
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="policyNumber"
                className="mb-2.5 block text-black dark:text-white"
              >
                Numéro de Police <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="policyNumber"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleInputChange}
                placeholder="POL-2024-XXX"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="mb-2.5 block text-black dark:text-white"
              >
                Type de Police <span className="text-danger">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="INDIVIDUAL">Individuel</option>
                <option value="FAMILY">Familial</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="coverage"
                className="mb-2.5 block text-black dark:text-white"
              >
                Couverture <span className="text-danger">*</span>
              </label>
              <select
                id="coverage"
                name="coverage"
                value={formData.coverage}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Sélectionner une couverture</option>
                <option value="Basique">Basique</option>
                <option value="Complète">Complète</option>
                <option value="Premium">Premium</option>
                <option value="Ultra">Ultra</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="insuranceCompanyId"
                className="mb-2.5 block text-black dark:text-white"
              >
                Compagnie d'Assurance <span className="text-danger">*</span>
              </label>
              <select
                id="insuranceCompanyId"
                name="insuranceCompanyId"
                value={formData.insuranceCompanyId}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Sélectionner une compagnie</option>
                {insuranceCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="deductible"
                className="mb-2.5 block text-black dark:text-white"
              >
                Franchise (€) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="deductible"
                name="deductible"
                value={formData.deductible}
                onChange={handleInputChange}
                placeholder="500"
                min="0"
                step="50"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="premiumAmount"
                className="mb-2.5 block text-black dark:text-white"
              >
                Montant de la Prime (€) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="premiumAmount"
                name="premiumAmount"
                value={formData.premiumAmount}
                onChange={handleInputChange}
                placeholder="1200"
                min="0"
                step="50"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="validUntil"
                className="mb-2.5 block text-black dark:text-white"
              >
                Date de Fin de Validité <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="validUntil"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2.5 block text-black dark:text-white"
            >
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description détaillée de la politique d'assurance..."
              rows={4}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-stroke dark:border-strokedark">
            <Link
              href="/admin/policies"
              className="flex items-center justify-center rounded border border-stroke px-6 py-2 text-sm font-medium text-black transition-all hover:shadow-1 dark:border-strokedark dark:text-white hover:bg-gray-100 dark:hover:bg-meta-4"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center rounded bg-primary px-6 py-2 text-sm font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Création...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Créer la Politique
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
