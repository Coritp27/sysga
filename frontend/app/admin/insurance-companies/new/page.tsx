"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InsuranceCompanyFormData {
  name: string;
  code: string;
  type: "PRIVATE" | "PUBLIC" | "MUTUAL" | "COOPERATIVE";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  financialInfo: {
    capital: string;
    annualRevenue: string;
    rating: string;
    foundedYear: string;
  };
  coverageTypes: string[];
  licenses: {
    number: string;
    issuingAuthority: string;
    expiryDate: string;
    status: "ACTIVE" | "EXPIRED" | "SUSPENDED";
  }[];
  additionalInfo: string;
}

const typeOptions = [
  { value: "PRIVATE", label: "Privée" },
  { value: "PUBLIC", label: "Publique" },
  { value: "MUTUAL", label: "Mutuelle" },
  { value: "COOPERATIVE", label: "Coopérative" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspendue" },
];

const ratingOptions = [
  "A++",
  "A+",
  "A",
  "A-",
  "B++",
  "B+",
  "B",
  "B-",
  "C++",
  "C+",
  "C",
  "C-",
  "D",
  "E",
  "F",
];

const coverageTypeOptions = [
  "Assurance vie",
  "Assurance santé",
  "Assurance automobile",
  "Assurance habitation",
  "Assurance voyage",
  "Assurance professionnelle",
  "Assurance responsabilité civile",
  "Assurance décès",
  "Assurance invalidité",
  "Assurance retraite",
  "Assurance scolaire",
  "Assurance animaux",
  "Assurance cyber",
  "Assurance juridique",
];

const licenseStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRED", label: "Expirée" },
  { value: "SUSPENDED", label: "Suspendue" },
];

export default function NewInsuranceCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<InsuranceCompanyFormData>({
    name: "",
    code: "",
    type: "PRIVATE",
    status: "ACTIVE",
    contactInfo: {
      email: "",
      phone: "",
      website: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    },
    financialInfo: {
      capital: "",
      annualRevenue: "",
      rating: "",
      foundedYear: "",
    },
    coverageTypes: [],
    licenses: [
      {
        number: "",
        issuingAuthority: "",
        expiryDate: "",
        status: "ACTIVE",
      },
    ],
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    code?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
    };
    financialInfo?: {
      foundedYear?: string;
    };
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("contactInfo.")) {
      const field = name.split(".")[1];
      if (field === "address") {
        const addressField = name.split(".")[2];
        setFormData((prev) => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            address: {
              ...prev.contactInfo.address,
              [addressField]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          contactInfo: { ...prev.contactInfo, [field]: value },
        }));
      }
      if (errors.contactInfo?.[field as keyof typeof errors.contactInfo]) {
        setErrors((prev) => ({
          ...prev,
          contactInfo: { ...prev.contactInfo, [field]: undefined },
        }));
      }
    } else if (name.startsWith("financialInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        financialInfo: { ...prev.financialInfo, [field]: value },
      }));
      if (errors.financialInfo?.[field as keyof typeof errors.financialInfo]) {
        setErrors((prev) => ({
          ...prev,
          financialInfo: { ...prev.financialInfo, [field]: undefined },
        }));
      }
    } else if (name === "coverageTypes") {
      setFormData((prev) => ({
        ...prev,
        coverageTypes: checked
          ? [...prev.coverageTypes, value]
          : prev.coverageTypes.filter((type) => type !== value),
      }));
    } else if (name.startsWith("licenses.")) {
      const parts = name.split(".");
      const licenseIndex = parseInt(parts[1]);
      const field = parts[2];
      setFormData((prev) => ({
        ...prev,
        licenses: prev.licenses.map((license, index) =>
          index === licenseIndex ? { ...license, [field]: value } : license
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const addLicense = () => {
    setFormData((prev) => ({
      ...prev,
      licenses: [
        ...prev.licenses,
        {
          number: "",
          issuingAuthority: "",
          expiryDate: "",
          status: "ACTIVE",
        },
      ],
    }));
  };

  const removeLicense = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      code?: string;
      contactInfo?: {
        email?: string;
        phone?: string;
      };
      financialInfo?: {
        foundedYear?: string;
      };
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Le code est requis";
    }

    if (
      formData.contactInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)
    ) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        email: "Email invalide",
      };
    }

    if (
      formData.contactInfo.phone &&
      !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.contactInfo.phone)
    ) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        phone: "Numéro de téléphone invalide",
      };
    }

    if (formData.financialInfo.foundedYear) {
      const year = parseInt(formData.financialInfo.foundedYear);
      if (isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
        newErrors.financialInfo = {
          ...newErrors.financialInfo,
          foundedYear: "Année invalide",
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ici, vous pouvez ajouter la logique pour sauvegarder la compagnie d'assurance
    console.log("Nouvelle compagnie d'assurance:", formData);

    // Redirection vers la liste des compagnies d'assurance
    router.push("/admin/insurance-companies");
  };

  const handleCancel = () => {
    router.push("/admin/insurance-companies");
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
            Nouvelle Compagnie d'Assurance
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
                Nom de la compagnie *
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
                placeholder="ex: AXA Assurance"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Code de la compagnie *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.code
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: AXA001"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type de compagnie
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
          </div>
        </div>

        {/* Informations de contact */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations de Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.contactInfo?.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="contact@compagnie.com"
              />
              {errors.contactInfo?.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contactInfo.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.contactInfo?.phone
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="+33 1 23 45 67 89"
              />
              {errors.contactInfo?.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contactInfo.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Site web
              </label>
              <input
                type="url"
                name="contactInfo.website"
                value={formData.contactInfo.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="https://www.compagnie.com"
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-black dark:text-white mb-3">
              Adresse
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Rue
                </label>
                <input
                  type="text"
                  name="contactInfo.address.street"
                  value={formData.contactInfo.address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="123 Rue de la Paix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  name="contactInfo.address.city"
                  value={formData.contactInfo.address.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Paris"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Région/État
                </label>
                <input
                  type="text"
                  name="contactInfo.address.state"
                  value={formData.contactInfo.address.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Île-de-France"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Code postal
                </label>
                <input
                  type="text"
                  name="contactInfo.address.postalCode"
                  value={formData.contactInfo.address.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="75001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Pays
                </label>
                <input
                  type="text"
                  name="contactInfo.address.country"
                  value={formData.contactInfo.address.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="France"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informations financières */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations Financières
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Capital social
              </label>
              <input
                type="text"
                name="financialInfo.capital"
                value={formData.financialInfo.capital}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 1,000,000 €"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Chiffre d'affaires annuel
              </label>
              <input
                type="text"
                name="financialInfo.annualRevenue"
                value={formData.financialInfo.annualRevenue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 50,000,000 €"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Note de solvabilité
              </label>
              <select
                name="financialInfo.rating"
                value={formData.financialInfo.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner</option>
                {ratingOptions.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Année de fondation
              </label>
              <input
                type="number"
                name="financialInfo.foundedYear"
                value={formData.financialInfo.foundedYear}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.financialInfo?.foundedYear
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: 1985"
                min="1800"
                max={new Date().getFullYear()}
              />
              {errors.financialInfo?.foundedYear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.financialInfo.foundedYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Types de couverture */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Types de Couverture Proposés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coverageTypeOptions.map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="coverageTypes"
                  value={type}
                  checked={formData.coverageTypes.includes(type)}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-black dark:text-white">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Licences */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Licences et Autorisations
            </h3>
            <button
              type="button"
              onClick={addLicense}
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-white hover:bg-opacity-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-1 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Ajouter une licence
            </button>
          </div>

          {formData.licenses.map((license, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4 dark:border-strokedark"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-black dark:text-white">
                  Licence {index + 1}
                </h4>
                {formData.licenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLicense(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Numéro de licence
                  </label>
                  <input
                    type="text"
                    name={`licenses.${index}.number`}
                    value={license.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                    placeholder="ex: LIC-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Autorité émettrice
                  </label>
                  <input
                    type="text"
                    name={`licenses.${index}.issuingAuthority`}
                    value={license.issuingAuthority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                    placeholder="ex: ACPR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Date d'expiration
                  </label>
                  <input
                    type="date"
                    name={`licenses.${index}.expiryDate`}
                    value={license.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Statut
                  </label>
                  <select
                    name={`licenses.${index}.status`}
                    value={license.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  >
                    {licenseStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
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
            Créer la Compagnie
          </button>
        </div>
      </form>
    </div>
  );
}
