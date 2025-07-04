"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InsuredPersonFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  cin: string;
  nif: string;
  hasDependent: boolean;
  numberOfDependent: number;
  policyEffectiveDate: string;
  enterpriseId?: number;
}

const genderOptions = [
  { value: "MALE", label: "Homme" },
  { value: "FEMALE", label: "Femme" },
  { value: "OTHER", label: "Autre" },
];

// Fonction pour réinitialiser le formulaire
const getInitialFormData = (): InsuredPersonFormData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "MALE",
  address: "",
  cin: "",
  nif: "",
  hasDependent: false,
  numberOfDependent: 0,
  policyEffectiveDate: "",
  enterpriseId: undefined,
});

export default function NewInsuredPersonPage() {
  const router = useRouter();
  const [formData, setFormData] =
    useState<InsuredPersonFormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    cin?: string;
    nif?: string;
    policyEffectiveDate?: string;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Effacer l'erreur du champ modifié
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (!formData.cin.trim()) {
      newErrors.cin = "Le CIN est requis";
    }

    if (!formData.nif.trim()) {
      newErrors.nif = "Le NIF est requis";
    }

    if (!formData.policyEffectiveDate) {
      newErrors.policyEffectiveDate =
        "La date d'effet de la police est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/insured-persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address,
          cin: formData.cin,
          nif: formData.nif,
          hasDependent: formData.hasDependent,
          numberOfDependent: formData.numberOfDependent,
          policyEffectiveDate: formData.policyEffectiveDate,
          enterpriseId: formData.enterpriseId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      // Réinitialiser le formulaire après succès
      setFormData(getInitialFormData());
      setErrors({});

      // Redirection vers la liste des personnes
      router.push("/admin/insured-persons");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert(
        error instanceof Error ? error.message : "Erreur lors de la création"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/insured-persons");
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Retour
          </button>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Nouvelle Personne Assurée
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations Personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

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
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

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
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.dateOfBirth
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Genre
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                CIN *
              </label>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cin
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.cin && (
                <p className="mt-1 text-sm text-red-500">{errors.cin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                NIF *
              </label>
              <input
                type="text"
                name="nif"
                value={formData.nif}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.nif
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.nif && (
                <p className="mt-1 text-sm text-red-500">{errors.nif}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Adresse *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.address
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Adresse complète..."
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Informations d'assurance */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations d'Assurance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Date d'effet de la police *
              </label>
              <input
                type="date"
                name="policyEffectiveDate"
                value={formData.policyEffectiveDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.policyEffectiveDate
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.policyEffectiveDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.policyEffectiveDate}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hasDependent"
                checked={formData.hasDependent}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label className="text-sm font-medium text-black dark:text-white">
                A des dépendants
              </label>
            </div>

            {formData.hasDependent && (
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nombre de dépendants
                </label>
                <input
                  type="number"
                  name="numberOfDependent"
                  value={formData.numberOfDependent}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                />
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-6 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Création..." : "Créer la Personne"}
          </button>
        </div>
      </form>
    </div>
  );
}
