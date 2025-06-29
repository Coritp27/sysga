"use client";

import { useState, useEffect } from "react";
import type { Enterprise } from "../../types/enterprise";

interface EnterpriseErrors {
  name?: string;
  email?: string;
  phone1?: string;
  address?: string;
  fiscalNumber?: string;
  numberOfEmployees?: string;
}

interface EnterpriseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Enterprise) => void;
  initialData?: Enterprise;
  mode: "create" | "edit";
}

export function EnterpriseForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: EnterpriseFormProps) {
  const [formData, setFormData] = useState<Enterprise>({
    id: undefined,
    name: "",
    email: "",
    phone1: "",
    phone2: "",
    address: "",
    website: "",
    fiscalNumber: "",
    numberOfEmployees: 0,
    insuranceCompanyId: 0,
  });

  const [errors, setErrors] = useState<EnterpriseErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
    if (errors[name as keyof EnterpriseErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: EnterpriseErrors = {};
    if (!formData.name.trim())
      newErrors.name = "Le nom de l'entreprise est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format d'email invalide";
    if (!formData.phone1.trim()) newErrors.phone1 = "Le téléphone est requis";
    if (!formData.address.trim()) newErrors.address = "L'adresse est requise";
    if (!formData.fiscalNumber.trim())
      newErrors.fiscalNumber = "Le numéro fiscal est requis";
    if (formData.numberOfEmployees <= 0)
      newErrors.numberOfEmployees =
        "Le nombre d'employés doit être supérieur à 0";
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
      id: undefined,
      name: "",
      email: "",
      phone1: "",
      phone2: "",
      address: "",
      website: "",
      fiscalNumber: "",
      numberOfEmployees: 0,
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
            {mode === "create"
              ? "Nouvelle Entreprise"
              : "Modifier l'Entreprise"}
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
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="Nom commercial"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="contact@entreprise.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone *
              </label>
              <input
                type="text"
                name="phone1"
                value={formData.phone1}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone1 ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="01 23 45 67 89"
              />
              {errors.phone1 && (
                <p className="mt-1 text-sm text-red-500">{errors.phone1}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone secondaire
              </label>
              <input
                type="text"
                name="phone2"
                value={formData.phone2 || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300 dark:border-strokedark dark:bg-boxdark"
                placeholder=""
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Adresse *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="Adresse complète"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site web</label>
              <input
                type="text"
                name="website"
                value={formData.website || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300 dark:border-strokedark dark:bg-boxdark"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                N° Fiscal *
              </label>
              <input
                type="text"
                name="fiscalNumber"
                value={formData.fiscalNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.fiscalNumber ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="FR..."
              />
              {errors.fiscalNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fiscalNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre d'employés *
              </label>
              <input
                type="number"
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.numberOfEmployees ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
                placeholder="0"
                min={1}
              />
              {errors.numberOfEmployees && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.numberOfEmployees}
                </p>
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
