"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InsuranceCardFormData {
  cardNumber: string;
  type: "HEALTH" | "AUTO" | "PROPERTY" | "LIFE";
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "SUSPENDED";
  holder: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  company: {
    id: number;
    name: string;
  };
  coverage: {
    type: string;
    description: string;
    limits: string;
    deductible: number;
  };
  benefits: string[];
  restrictions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  additionalInfo: string;
  validFrom: string;
  validUntil: string;
}

const typeOptions = [
  { value: "HEALTH", label: "Santé" },
  { value: "AUTO", label: "Automobile" },
  { value: "PROPERTY", label: "Habitation" },
  { value: "LIFE", label: "Vie" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "EXPIRED", label: "Expirée" },
  { value: "SUSPENDED", label: "Suspendue" },
];

const benefitOptions = [
  "Couverture hospitalisation",
  "Consultations médicales",
  "Médicaments",
  "Soins dentaires",
  "Soins optiques",
  "Transport médical",
  "Rééducation",
  "Médecine préventive",
];

const restrictionOptions = [
  "Maladies préexistantes",
  "Traitements cosmétiques",
  "Médecine alternative",
  "Soins dentaires",
  "Chirurgie esthétique",
  "Médicaments non remboursés",
];

const mockCompanies = [
  { id: 1, name: "AXA Assurance" },
  { id: 2, name: "Allianz France" },
  { id: 3, name: "Groupama" },
  { id: 4, name: "MAIF" },
  { id: 5, name: "MACIF" },
];

export default function NewInsuranceCardPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<InsuranceCardFormData>({
    cardNumber: "",
    type: "HEALTH",
    status: "ACTIVE",
    holder: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
    },
    company: {
      id: 0,
      name: "",
    },
    coverage: {
      type: "",
      description: "",
      limits: "",
      deductible: 0,
    },
    benefits: [],
    restrictions: [],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    additionalInfo: "",
    validFrom: "",
    validUntil: "",
  });

  const [errors, setErrors] = useState<{
    cardNumber?: string;
    validFrom?: string;
    validUntil?: string;
    holder?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    company?: {
      id?: string;
    };
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("holder.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        holder: { ...prev.holder, [field]: value },
      }));
      if (errors.holder?.[field as keyof typeof errors.holder]) {
        setErrors((prev) => ({
          ...prev,
          holder: { ...prev.holder, [field]: undefined },
        }));
      }
    } else if (name.startsWith("company.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          [field]: field === "id" ? Number(value) : value,
        },
      }));
      if (errors.company?.[field as keyof typeof errors.company]) {
        setErrors((prev) => ({
          ...prev,
          company: { ...prev.company, [field]: undefined },
        }));
      }
    } else if (name.startsWith("coverage.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        coverage: {
          ...prev.coverage,
          [field]: field === "deductible" ? Number(value) : value,
        },
      }));
    } else if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
    } else if (name === "benefits" || name === "restrictions") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...(prev[name as keyof typeof prev] as string[]), value]
          : (prev[name as keyof typeof prev] as string[]).filter(
              (item) => item !== value
            ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      cardNumber?: string;
      validFrom?: string;
      validUntil?: string;
      holder?: {
        firstName?: string;
        lastName?: string;
        email?: string;
      };
      company?: {
        id?: string;
      };
    } = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    }

    if (!formData.holder.firstName.trim()) {
      newErrors.holder = {
        ...newErrors.holder,
        firstName: "Le prénom est requis",
      };
    }

    if (!formData.holder.lastName.trim()) {
      newErrors.holder = { ...newErrors.holder, lastName: "Le nom est requis" };
    }

    if (!formData.holder.email.trim()) {
      newErrors.holder = { ...newErrors.holder, email: "L'email est requis" };
    }

    if (!formData.company.id) {
      newErrors.company = {
        ...newErrors.company,
        id: "La compagnie est requise",
      };
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "La date de début est requise";
    }

    if (!formData.validUntil) {
      newErrors.validUntil = "La date de fin est requise";
    }

    // Validation des dates
    if (formData.validFrom && formData.validUntil) {
      const startDate = new Date(formData.validFrom);
      const endDate = new Date(formData.validUntil);
      if (startDate >= endDate) {
        newErrors.validUntil =
          "La date de fin doit être postérieure à la date de début";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ici, vous pouvez ajouter la logique pour sauvegarder la carte
    console.log("Nouvelle carte d'assurance:", formData);

    // Redirection vers la liste des cartes
    router.push("/admin/insurance-cards");
  };

  const handleCancel = () => {
    router.push("/admin/insurance-cards");
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
            Nouvelle Carte d'Assurance
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations de Base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Numéro de carte *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cardNumber
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: CARD-2024-001"
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type de carte *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Compagnie d'assurance *
              </label>
              <select
                name="company.id"
                value={formData.company.id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.company?.id
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              >
                <option value="">Sélectionner une compagnie</option>
                {mockCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.company?.id && (
                <p className="mt-1 text-sm text-red-500">{errors.company.id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Date de début de validité *
              </label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.validFrom
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.validFrom && (
                <p className="mt-1 text-sm text-red-500">{errors.validFrom}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Date de fin de validité *
              </label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.validUntil
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.validUntil && (
                <p className="mt-1 text-sm text-red-500">{errors.validUntil}</p>
              )}
            </div>
          </div>
        </div>

        {/* Informations du titulaire */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations du Titulaire
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="holder.firstName"
                value={formData.holder.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.holder?.firstName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.holder?.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.holder.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="holder.lastName"
                value={formData.holder.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.holder?.lastName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.holder?.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.holder.lastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Email *
              </label>
              <input
                type="email"
                name="holder.email"
                value={formData.holder.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.holder?.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.holder?.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.holder.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="holder.phone"
                value={formData.holder.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                name="holder.dateOfBirth"
                value={formData.holder.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
        </div>

        {/* Couverture et avantages */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Couverture et Avantages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type de couverture
              </label>
              <input
                type="text"
                name="coverage.type"
                value={formData.coverage.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: Couverture complète"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Franchise (€)
              </label>
              <input
                type="number"
                name="coverage.deductible"
                value={formData.coverage.deductible}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description de la couverture
              </label>
              <textarea
                name="coverage.description"
                value={formData.coverage.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Description détaillée de la couverture..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Limites de couverture
              </label>
              <input
                type="text"
                name="coverage.limits"
                value={formData.coverage.limits}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 50,000 € par an"
              />
            </div>
          </div>

          {/* Avantages */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Avantages inclus
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefitOptions.map((benefit) => (
                <label key={benefit} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="benefits"
                    value={benefit}
                    checked={formData.benefits.includes(benefit)}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {benefit}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Restrictions et exclusions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {restrictionOptions.map((restriction) => (
                <label
                  key={restriction}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    name="restrictions"
                    value={restriction}
                    checked={formData.restrictions.includes(restriction)}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {restriction}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contact d'urgence */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Contact d'Urgence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nom complet
              </label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Relation
              </label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: Conjoint, Parent, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="emergencyContact.email"
                value={formData.emergencyContact.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations Supplémentaires
          </h3>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Notes et commentaires
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              placeholder="Informations supplémentaires, notes spéciales, etc."
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-6 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            Créer la Carte
          </button>
        </div>
      </form>
    </div>
  );
}
