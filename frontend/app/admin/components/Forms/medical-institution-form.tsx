"use client";

import { useState, useEffect } from "react";

interface MedicalInstitution {
  id?: number;
  name: string;
  type: "HOSPITAL" | "CLINIC" | "LABORATORY" | "PHARMACY";
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  licenseNumber: string;
  contactPerson: string;
  isActive: boolean;
}

interface MedicalInstitutionErrors {
  name?: string;
  type?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  contactPerson?: string;
  isActive?: string;
}

interface MedicalInstitutionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalInstitution) => void;
  initialData?: MedicalInstitution;
  mode: "create" | "edit";
}

export function MedicalInstitutionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: MedicalInstitutionFormProps) {
  const [formData, setFormData] = useState<MedicalInstitution>({
    name: "",
    type: "HOSPITAL",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    licenseNumber: "",
    contactPerson: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<MedicalInstitutionErrors>({});

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
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof MedicalInstitutionErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: MedicalInstitutionErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ville est requise";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "Le numéro de licence est requis";
    }

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
      name: "",
      type: "HOSPITAL",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      email: "",
      licenseNumber: "",
      contactPerson: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl dark:bg-boxdark">
        <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {mode === "create"
              ? "Nouvelle Institution Médicale"
              : "Modifier l'Institution"}
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
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nom de l'institution *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Nom de l'institution"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type d'institution *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="HOSPITAL">Hôpital</option>
                <option value="CLINIC">Clinique</option>
                <option value="LABORATORY">Laboratoire</option>
                <option value="PHARMACY">Pharmacie</option>
              </select>
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Adresse *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.address
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Adresse complète"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Ville *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.city
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Ville"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            {/* Code postal */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Code postal *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.postalCode
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Code postal"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Téléphone"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="email@exemple.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Numéro de licence */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Numéro de licence *
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.licenseNumber
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Numéro de licence"
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.licenseNumber}
                </p>
              )}
            </div>

            {/* Personne de contact */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Personne de contact
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Nom du contact principal"
              />
            </div>

            {/* Statut actif */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-black dark:text-white">
                  Institution active
                </span>
              </label>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-stroke dark:border-strokedark">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-boxdark dark:text-gray-300 dark:border-strokedark dark:hover:bg-boxdark-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mode === "create" ? "Créer" : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
