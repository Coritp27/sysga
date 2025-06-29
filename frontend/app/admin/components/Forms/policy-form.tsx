"use client";

import { useState, useEffect } from "react";
import { Policy } from "../../types/policy";

interface PolicyErrors {
  policyNumber?: string;
  type?: string;
  coverage?: string;
  deductible?: string;
  premiumAmount?: string;
  description?: string;
  validUntil?: string;
}

interface PolicyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Policy) => void;
  initialData?: Policy;
  mode: "create" | "edit";
}

export function PolicyForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: PolicyFormProps) {
  const [formData, setFormData] = useState<Policy>({
    policyNumber: 0,
    type: "INDIVIDUAL",
    coverage: "",
    deductible: 0,
    premiumAmount: 0,
    description: "",
    validUntil: "",
    insuranceCompanyId: 0,
  });

  const [errors, setErrors] = useState<PolicyErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const typeOptions = [
    { value: "INDIVIDUAL", label: "Individuelle" },
    { value: "FAMILY", label: "Famille" },
    { value: "GROUP", label: "Groupe" },
    { value: "ENTERPRISE", label: "Entreprise" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (errors[name as keyof PolicyErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PolicyErrors = {};
    if (!formData.policyNumber || formData.policyNumber <= 0)
      newErrors.policyNumber = "Le numéro de police est requis";
    if (!formData.type) newErrors.type = "Le type est requis";
    if (!formData.coverage.trim())
      newErrors.coverage = "La couverture est requise";
    if (formData.deductible < 0)
      newErrors.deductible = "La franchise doit être positive";
    if (formData.premiumAmount <= 0)
      newErrors.premiumAmount = "La prime doit être supérieure à 0";
    if (!formData.description.trim())
      newErrors.description = "La description est requise";
    if (!formData.validUntil)
      newErrors.validUntil = "La date de validité est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      policyNumber: 0,
      type: "INDIVIDUAL",
      coverage: "",
      deductible: 0,
      premiumAmount: 0,
      description: "",
      validUntil: "",
      insuranceCompanyId: 0,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl dark:bg-boxdark">
        <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {mode === "create" ? "Nouvelle Police" : "Modifier la Police"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Numéro de police *
              </label>
              <input
                type="number"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.policyNumber ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="Numéro unique"
              />
              {errors.policyNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.policyNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.type ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Couverture *
              </label>
              <input
                type="text"
                name="coverage"
                value={formData.coverage}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.coverage ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="Ex: Couverture santé complète"
              />
              {errors.coverage && (
                <p className="mt-1 text-sm text-red-500">{errors.coverage}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Franchise *
              </label>
              <input
                type="number"
                step="0.01"
                name="deductible"
                value={formData.deductible}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.deductible ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="0.00"
                min={0}
              />
              {errors.deductible && (
                <p className="mt-1 text-sm text-red-500">{errors.deductible}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Prime annuelle *
              </label>
              <input
                type="number"
                step="0.01"
                name="premiumAmount"
                value={formData.premiumAmount}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.premiumAmount ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="0.00"
                min={0}
              />
              {errors.premiumAmount && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.premiumAmount}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="Description détaillée de la police"
                rows={3}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date de validité *
              </label>
              <input
                type="date"
                name="validUntil"
                value={
                  formData.validUntil
                    ? formData.validUntil.substring(0, 10)
                    : ""
                }
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.validUntil ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.validUntil && (
                <p className="mt-1 text-sm text-red-500">{errors.validUntil}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
            >
              {mode === "create" ? "Créer" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
