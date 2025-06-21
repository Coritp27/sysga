"use client";

import { useState, useEffect } from "react";
import { Policy } from "../../types/policy";

interface PolicyErrors {
  policyNumber?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  premium?: string;
  coverage?: string;
  deductible?: string;
  coPay?: string;
  insuredPerson?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  insuranceCompany?: {
    id?: string;
    name?: string;
  };
  enterprise?: {
    id?: string;
    name?: string;
  };
  coverageDetails?: {
    type?: string;
    description?: string;
    limits?: string;
    exclusions?: string;
  };
  paymentInfo?: {
    frequency?: string;
    method?: string;
    nextPaymentDate?: string;
    lastPaymentDate?: string;
  };
  notes?: string;
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
    policyNumber: "",
    type: "INDIVIDUAL",
    status: "PENDING",
    startDate: "",
    endDate: "",
    premium: 0,
    coverage: 0,
    deductible: 0,
    coPay: 0,
    insuredPerson: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    insuranceCompany: {
      id: 0,
      name: "",
    },
    enterprise: {
      id: 0,
      name: "",
    },
    coverageDetails: {
      type: "",
      description: "",
      limits: "",
      exclusions: [],
    },
    paymentInfo: {
      frequency: "MONTHLY",
      method: "BANK_TRANSFER",
      nextPaymentDate: "",
      lastPaymentDate: "",
    },
    documents: {
      policyDocument: "",
      termsConditions: "",
      additionalDocuments: [],
    },
    notes: "",
    createdAt: "",
  });

  const [errors, setErrors] = useState<PolicyErrors>({});

  const typeOptions = [
    { value: "INDIVIDUAL", label: "Individuelle" },
    { value: "FAMILY", label: "Famille" },
    { value: "GROUP", label: "Groupe" },
    { value: "ENTERPRISE", label: "Entreprise" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "EXPIRED", label: "Expirée" },
    { value: "PENDING", label: "En attente" },
    { value: "CANCELLED", label: "Annulée" },
  ];

  const frequencyOptions = [
    { value: "MONTHLY", label: "Mensuel" },
    { value: "QUARTERLY", label: "Trimestriel" },
    { value: "SEMI_ANNUAL", label: "Semestriel" },
    { value: "ANNUAL", label: "Annuel" },
  ];

  const paymentMethodOptions = [
    { value: "BANK_TRANSFER", label: "Virement bancaire" },
    { value: "CREDIT_CARD", label: "Carte de crédit" },
    { value: "DEBIT_CARD", label: "Carte de débit" },
    { value: "CHECK", label: "Chèque" },
  ];

  const exclusionOptions = [
    "Maladies préexistantes",
    "Accidents de sport extrême",
    "Traitements cosmétiques",
    "Médecine alternative",
    "Soins dentaires",
    "Lunettes et lentilles",
    "Grossesse et accouchement",
    "Maladies psychiatriques",
    "Traitements expérimentaux",
    "Accidents de travail",
  ];

  // Données mockées pour les sélections
  const mockInsuredPersons = [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.com",
      phone: "01 23 45 67 89",
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@email.com",
      phone: "01 98 76 54 32",
    },
    {
      id: 3,
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@email.com",
      phone: "01 45 67 89 12",
    },
  ];

  const mockInsuranceCompanies = [
    { id: 1, name: "AXA Assurance" },
    { id: 2, name: "Allianz France" },
    { id: 3, name: "Groupama" },
    { id: 4, name: "MAIF" },
    { id: 5, name: "MACIF" },
  ];

  const mockEnterprises = [
    { id: 1, name: "TechCorp Solutions" },
    { id: 2, name: "Innovation Labs" },
    { id: 3, name: "Digital Systems" },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        insuredPerson: initialData.insuredPerson || {
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
        insuranceCompany: initialData.insuranceCompany || {
          id: 0,
          name: "",
        },
        enterprise: initialData.enterprise || {
          id: 0,
          name: "",
        },
        coverageDetails: initialData.coverageDetails || {
          type: "",
          description: "",
          limits: "",
          exclusions: [],
        },
        paymentInfo: initialData.paymentInfo || {
          frequency: "MONTHLY",
          method: "BANK_TRANSFER",
          nextPaymentDate: "",
          lastPaymentDate: "",
        },
        documents: initialData.documents || {
          policyDocument: "",
          termsConditions: "",
          additionalDocuments: [],
        },
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("insuredPerson.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        insuredPerson: {
          ...prev.insuredPerson!,
          [field]: field === "id" ? Number(value) : value,
        },
      }));
      if (errors.insuredPerson?.[field as keyof typeof errors.insuredPerson]) {
        setErrors((prev) => ({
          ...prev,
          insuredPerson: { ...prev.insuredPerson, [field]: undefined },
        }));
      }
    } else if (name.startsWith("insuranceCompany.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        insuranceCompany: {
          ...prev.insuranceCompany!,
          [field]: field === "id" ? Number(value) : value,
        },
      }));
      if (
        errors.insuranceCompany?.[field as keyof typeof errors.insuranceCompany]
      ) {
        setErrors((prev) => ({
          ...prev,
          insuranceCompany: { ...prev.insuranceCompany, [field]: undefined },
        }));
      }
    } else if (name.startsWith("enterprise.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        enterprise: {
          ...prev.enterprise!,
          [field]: field === "id" ? Number(value) : value,
        },
      }));
      if (errors.enterprise?.[field as keyof typeof errors.enterprise]) {
        setErrors((prev) => ({
          ...prev,
          enterprise: { ...prev.enterprise, [field]: undefined },
        }));
      }
    } else if (name.startsWith("coverageDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        coverageDetails: {
          ...prev.coverageDetails!,
          [field]: value,
        },
      }));
      if (
        errors.coverageDetails?.[field as keyof typeof errors.coverageDetails]
      ) {
        setErrors((prev) => ({
          ...prev,
          coverageDetails: { ...prev.coverageDetails, [field]: undefined },
        }));
      }
    } else if (name.startsWith("paymentInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        paymentInfo: {
          ...prev.paymentInfo!,
          [field]: value,
        },
      }));
      if (errors.paymentInfo?.[field as keyof typeof errors.paymentInfo]) {
        setErrors((prev) => ({
          ...prev,
          paymentInfo: { ...prev.paymentInfo, [field]: undefined },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? Number(value)
              : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof PolicyErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleExclusionChange = (exclusion: string) => {
    setFormData((prev) => ({
      ...prev,
      coverageDetails: {
        ...prev.coverageDetails!,
        exclusions: prev.coverageDetails.exclusions.includes(exclusion)
          ? prev.coverageDetails.exclusions.filter((e) => e !== exclusion)
          : [...prev.coverageDetails.exclusions, exclusion],
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: PolicyErrors = {};

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "Le numéro de police est requis";
    }

    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }

    if (formData.premium <= 0) {
      newErrors.premium = "La prime doit être supérieure à 0";
    }

    if (formData.coverage <= 0) {
      newErrors.coverage = "La couverture doit être supérieure à 0";
    }

    // Validation des dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate =
          "La date de fin doit être postérieure à la date de début";
      }
    }

    if (!formData.insuredPerson?.id) {
      newErrors.insuredPerson = {
        ...newErrors.insuredPerson,
        id: "La personne assurée est requise",
      };
    }

    if (!formData.insuranceCompany?.id) {
      newErrors.insuranceCompany = {
        ...newErrors.insuranceCompany,
        id: "La compagnie d'assurance est requise",
      };
    }

    // Validation pour les polices d'entreprise
    if (formData.type === "ENTERPRISE" && !formData.enterprise?.id) {
      newErrors.enterprise = {
        ...newErrors.enterprise,
        id: "L'entreprise est requise pour une police d'entreprise",
      };
    }

    // Validation des détails de couverture
    const coverageErrors: any = {};
    if (!formData.coverageDetails?.type?.trim()) {
      coverageErrors.type = "Le type de couverture est requis";
    }
    if (!formData.coverageDetails?.description?.trim()) {
      coverageErrors.description =
        "La description de la couverture est requise";
    }
    if (!formData.coverageDetails?.limits?.trim()) {
      coverageErrors.limits = "Les limites de couverture sont requises";
    }

    if (Object.keys(coverageErrors).length > 0) {
      newErrors.coverageDetails = coverageErrors;
    }

    // Validation des informations de paiement
    const paymentErrors: any = {};
    if (!formData.paymentInfo?.nextPaymentDate) {
      paymentErrors.nextPaymentDate =
        "La date du prochain paiement est requise";
    }

    if (Object.keys(paymentErrors).length > 0) {
      newErrors.paymentInfo = paymentErrors;
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
      policyNumber: "",
      type: "INDIVIDUAL",
      status: "PENDING",
      startDate: "",
      endDate: "",
      premium: 0,
      coverage: 0,
      deductible: 0,
      coPay: 0,
      insuredPerson: {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      insuranceCompany: {
        id: 0,
        name: "",
      },
      enterprise: {
        id: 0,
        name: "",
      },
      coverageDetails: {
        type: "",
        description: "",
        limits: "",
        exclusions: [],
      },
      paymentInfo: {
        frequency: "MONTHLY",
        method: "BANK_TRANSFER",
        nextPaymentDate: "",
        lastPaymentDate: "",
      },
      documents: {
        policyDocument: "",
        termsConditions: "",
        additionalDocuments: [],
      },
      notes: "",
      createdAt: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl dark:bg-boxdark">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Informations de Base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Numéro de police *
                </label>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.policyNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: POL-2024-001"
                />
                {errors.policyNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.policyNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Type de police *
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
                  Statut *
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
                  Date de début *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.startDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Date de fin *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.endDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Informations financières */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Informations Financières
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Prime annuelle (€) *
                </label>
                <input
                  type="number"
                  name="premium"
                  value={formData.premium}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.premium
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 1200"
                />
                {errors.premium && (
                  <p className="mt-1 text-sm text-red-500">{errors.premium}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Couverture (€) *
                </label>
                <input
                  type="number"
                  name="coverage"
                  value={formData.coverage}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.coverage
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 50000"
                />
                {errors.coverage && (
                  <p className="mt-1 text-sm text-red-500">{errors.coverage}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Franchise (€)
                </label>
                <input
                  type="number"
                  name="deductible"
                  value={formData.deductible}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Participation (%)
                </label>
                <input
                  type="number"
                  name="coPay"
                  value={formData.coPay}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 20"
                />
              </div>
            </div>
          </div>

          {/* Personne assurée et compagnie */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Personne Assurée et Compagnie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Personne assurée *
                </label>
                <select
                  name="insuredPerson.id"
                  value={formData.insuredPerson?.id || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.insuredPerson?.id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                >
                  <option value="">Sélectionner une personne</option>
                  {mockInsuredPersons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName} - {person.email}
                    </option>
                  ))}
                </select>
                {errors.insuredPerson?.id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.insuredPerson.id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Compagnie d'assurance *
                </label>
                <select
                  name="insuranceCompany.id"
                  value={formData.insuranceCompany?.id || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.insuranceCompany?.id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                >
                  <option value="">Sélectionner une compagnie</option>
                  {mockInsuranceCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.insuranceCompany?.id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.insuranceCompany.id}
                  </p>
                )}
              </div>

              {formData.type === "ENTERPRISE" && (
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Entreprise *
                  </label>
                  <select
                    name="enterprise.id"
                    value={formData.enterprise?.id || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.enterprise?.id
                        ? "border-red-500"
                        : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                    }`}
                  >
                    <option value="">Sélectionner une entreprise</option>
                    {mockEnterprises.map((enterprise) => (
                      <option key={enterprise.id} value={enterprise.id}>
                        {enterprise.name}
                      </option>
                    ))}
                  </select>
                  {errors.enterprise?.id && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.enterprise.id}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Détails de couverture */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Détails de Couverture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Type de couverture *
                </label>
                <input
                  type="text"
                  name="coverageDetails.type"
                  value={formData.coverageDetails?.type || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.coverageDetails?.type
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: Couverture complète santé"
                />
                {errors.coverageDetails?.type && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.coverageDetails.type}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Limites de couverture *
                </label>
                <input
                  type="text"
                  name="coverageDetails.limits"
                  value={formData.coverageDetails?.limits || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.coverageDetails?.limits
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 50,000 € par an"
                />
                {errors.coverageDetails?.limits && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.coverageDetails.limits}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Description de la couverture *
                </label>
                <textarea
                  name="coverageDetails.description"
                  value={formData.coverageDetails?.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.coverageDetails?.description
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Description détaillée de la couverture..."
                />
                {errors.coverageDetails?.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.coverageDetails.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Exclusions */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Exclusions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {exclusionOptions.map((exclusion) => (
                <label key={exclusion} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.coverageDetails.exclusions.includes(
                      exclusion
                    )}
                    onChange={() => handleExclusionChange(exclusion)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {exclusion}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Informations de paiement */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Informations de Paiement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Fréquence de paiement
                </label>
                <select
                  name="paymentInfo.frequency"
                  value={formData.paymentInfo?.frequency || "MONTHLY"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Méthode de paiement
                </label>
                <select
                  name="paymentInfo.method"
                  value={formData.paymentInfo?.method || "BANK_TRANSFER"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                >
                  {paymentMethodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Prochain paiement *
                </label>
                <input
                  type="date"
                  name="paymentInfo.nextPaymentDate"
                  value={formData.paymentInfo?.nextPaymentDate || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.paymentInfo?.nextPaymentDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.paymentInfo?.nextPaymentDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.paymentInfo.nextPaymentDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Dernier paiement
                </label>
                <input
                  type="date"
                  name="paymentInfo.lastPaymentDate"
                  value={formData.paymentInfo?.lastPaymentDate || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              placeholder="Notes additionnelles..."
            />
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
