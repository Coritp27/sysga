"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EnterpriseFormData {
  name: string;
  code: string;
  type: "SMALL" | "MEDIUM" | "LARGE" | "STARTUP" | "CORPORATE";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  industry: string;
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
    annualRevenue: string;
    employeeCount: string;
    foundedYear: string;
    taxId: string;
  };
  insuranceInfo: {
    primaryContact: {
      name: string;
      position: string;
      email: string;
      phone: string;
    };
    policies: {
      id: number;
      number: string;
      type: string;
      status: string;
    }[];
  };
  additionalInfo: string;
}

const typeOptions = [
  { value: "SMALL", label: "Petite entreprise" },
  { value: "MEDIUM", label: "Moyenne entreprise" },
  { value: "LARGE", label: "Grande entreprise" },
  { value: "STARTUP", label: "Startup" },
  { value: "CORPORATE", label: "Corporation" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspendue" },
];

const industryOptions = [
  "Technologie",
  "Santé",
  "Finance",
  "Éducation",
  "Commerce de détail",
  "Manufacture",
  "Construction",
  "Transport",
  "Énergie",
  "Télécommunications",
  "Médias",
  "Hôtellerie",
  "Restaurant",
  "Consulting",
  "Services professionnels",
  "Immobilier",
  "Agriculture",
  "Automobile",
  "Aéronautique",
  "Pharmaceutique",
  "Autre",
];

const mockPolicies = [
  {
    id: 1,
    number: "POL-2024-001",
    type: "Assurance responsabilité civile",
    status: "Active",
  },
  {
    id: 2,
    number: "POL-2024-002",
    type: "Assurance professionnelle",
    status: "Active",
  },
  { id: 3, number: "POL-2024-003", type: "Assurance biens", status: "Active" },
  { id: 4, number: "POL-2024-004", type: "Assurance cyber", status: "Active" },
  {
    id: 5,
    number: "POL-2024-005",
    type: "Assurance transport",
    status: "Active",
  },
];

export default function NewEnterprisePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EnterpriseFormData>({
    name: "",
    code: "",
    type: "MEDIUM",
    status: "ACTIVE",
    industry: "",
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
      annualRevenue: "",
      employeeCount: "",
      foundedYear: "",
      taxId: "",
    },
    insuranceInfo: {
      primaryContact: {
        name: "",
        position: "",
        email: "",
        phone: "",
      },
      policies: [
        {
          id: 0,
          number: "",
          type: "",
          status: "Active",
        },
      ],
    },
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
      employeeCount?: string;
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
    } else if (name.startsWith("insuranceInfo.primaryContact.")) {
      const field = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        insuranceInfo: {
          ...prev.insuranceInfo,
          primaryContact: {
            ...prev.insuranceInfo.primaryContact,
            [field]: value,
          },
        },
      }));
    } else if (name.startsWith("insuranceInfo.policies.")) {
      const parts = name.split(".");
      const policyIndex = parseInt(parts[2]);
      const field = parts[3];
      setFormData((prev) => ({
        ...prev,
        insuranceInfo: {
          ...prev.insuranceInfo,
          policies: prev.insuranceInfo.policies.map((policy, index) =>
            index === policyIndex
              ? { ...policy, [field]: field === "id" ? Number(value) : value }
              : policy
          ),
        },
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

  const addPolicy = () => {
    setFormData((prev) => ({
      ...prev,
      insuranceInfo: {
        ...prev.insuranceInfo,
        policies: [
          ...prev.insuranceInfo.policies,
          {
            id: 0,
            number: "",
            type: "",
            status: "Active",
          },
        ],
      },
    }));
  };

  const removePolicy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      insuranceInfo: {
        ...prev.insuranceInfo,
        policies: prev.insuranceInfo.policies.filter((_, i) => i !== index),
      },
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
        employeeCount?: string;
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

    if (formData.financialInfo.employeeCount) {
      const count = parseInt(formData.financialInfo.employeeCount);
      if (isNaN(count) || count < 1) {
        newErrors.financialInfo = {
          ...newErrors.financialInfo,
          employeeCount: "Nombre d'employés invalide",
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ici, vous pouvez ajouter la logique pour sauvegarder l'entreprise
    console.log("Nouvelle entreprise:", formData);

    // Redirection vers la liste des entreprises
    router.push("/admin/enterprises");
  };

  const handleCancel = () => {
    router.push("/admin/enterprises");
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
            Nouvelle Entreprise
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
                Nom de l'entreprise *
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
                placeholder="ex: TechCorp Solutions"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Code de l'entreprise *
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
                placeholder="ex: TCS001"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type d'entreprise
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
                Secteur d'activité
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner un secteur</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
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
                placeholder="contact@entreprise.com"
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
                placeholder="https://www.entreprise.com"
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
                Chiffre d'affaires annuel
              </label>
              <input
                type="text"
                name="financialInfo.annualRevenue"
                value={formData.financialInfo.annualRevenue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 5,000,000 €"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nombre d'employés
              </label>
              <input
                type="number"
                name="financialInfo.employeeCount"
                value={formData.financialInfo.employeeCount}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.financialInfo?.employeeCount
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: 50"
                min="1"
              />
              {errors.financialInfo?.employeeCount && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.financialInfo.employeeCount}
                </p>
              )}
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
                placeholder="ex: 2010"
                min="1800"
                max={new Date().getFullYear()}
              />
              {errors.financialInfo?.foundedYear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.financialInfo.foundedYear}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Numéro de TVA/SIRET
              </label>
              <input
                type="text"
                name="financialInfo.taxId"
                value={formData.financialInfo.taxId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: FR12345678901"
              />
            </div>
          </div>
        </div>

        {/* Informations d'assurance */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations d'Assurance
          </h3>

          {/* Contact principal */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-black dark:text-white mb-3">
              Contact Principal pour l'Assurance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="insuranceInfo.primaryContact.name"
                  value={formData.insuranceInfo.primaryContact.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Poste
                </label>
                <input
                  type="text"
                  name="insuranceInfo.primaryContact.position"
                  value={formData.insuranceInfo.primaryContact.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: Directeur Financier"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="insuranceInfo.primaryContact.email"
                  value={formData.insuranceInfo.primaryContact.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="insuranceInfo.primaryContact.phone"
                  value={formData.insuranceInfo.primaryContact.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          {/* Polices d'assurance */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-black dark:text-white">
                Polices d'Assurance
              </h4>
              <button
                type="button"
                onClick={addPolicy}
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
                Ajouter une police
              </button>
            </div>

            {formData.insuranceInfo.policies.map((policy, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-4 dark:border-strokedark"
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-black dark:text-white">
                    Police {index + 1}
                  </h5>
                  {formData.insuranceInfo.policies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePolicy(index)}
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
                      Numéro de police
                    </label>
                    <input
                      type="text"
                      name={`insuranceInfo.policies.${index}.number`}
                      value={policy.number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      placeholder="ex: POL-2024-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Type de police
                    </label>
                    <input
                      type="text"
                      name={`insuranceInfo.policies.${index}.type`}
                      value={policy.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      placeholder="ex: Responsabilité civile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Statut
                    </label>
                    <select
                      name={`insuranceInfo.policies.${index}.status`}
                      value={policy.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Expired">Expirée</option>
                      <option value="Suspended">Suspendue</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
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
            Créer l'Entreprise
          </button>
        </div>
      </form>
    </div>
  );
}
