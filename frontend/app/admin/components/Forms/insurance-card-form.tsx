"use client";

import { useState, useEffect } from "react";

interface InsuranceCard {
  id?: number;
  cardNumber: string;
  cardType: "HEALTH" | "LIFE" | "AUTO" | "HOME" | "TRAVEL" | "PROFESSIONAL";
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "PENDING";
  issueDate: string;
  expiryDate: string;
  holder: {
    id: number;
    name: string;
    type: "INDIVIDUAL" | "FAMILY" | "ENTERPRISE";
  };
  insuranceCompany: {
    id: number;
    name: string;
  };
  coverage: {
    type: string;
    amount: string;
    deductible?: string;
    coPay?: string;
  };
  benefits: string[];
  restrictions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  additionalInfo?: {
    notes?: string;
    specialConditions?: string;
    networkProviders?: string[];
  };
  isActive: boolean;
}

interface InsuranceCardErrors {
  cardNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  holder?: {
    id?: string;
    name?: string;
    type?: string;
  };
  insuranceCompany?: {
    id?: string;
    name?: string;
  };
  coverage?: {
    type?: string;
    amount?: string;
    deductible?: string;
    coPay?: string;
  };
  benefits?: string;
  restrictions?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  additionalInfo?: {
    notes?: string;
    specialConditions?: string;
    networkProviders?: string;
  };
  isActive?: string;
}

interface InsuranceCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsuranceCard) => void;
  initialData?: InsuranceCard;
  mode: "create" | "edit";
}

export function InsuranceCardForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: InsuranceCardFormProps) {
  const [formData, setFormData] = useState<InsuranceCard>({
    cardNumber: "",
    cardType: "HEALTH",
    status: "ACTIVE",
    issueDate: "",
    expiryDate: "",
    holder: {
      id: 0,
      name: "",
      type: "INDIVIDUAL",
    },
    insuranceCompany: {
      id: 0,
      name: "",
    },
    coverage: {
      type: "",
      amount: "",
      deductible: "",
      coPay: "",
    },
    benefits: [],
    restrictions: [],
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    additionalInfo: {
      notes: "",
      specialConditions: "",
      networkProviders: [],
    },
    isActive: true,
  });

  const [errors, setErrors] = useState<InsuranceCardErrors>({});

  const cardTypeOptions = [
    { value: "HEALTH", label: "Santé" },
    { value: "LIFE", label: "Vie" },
    { value: "AUTO", label: "Auto" },
    { value: "HOME", label: "Habitation" },
    { value: "TRAVEL", label: "Voyage" },
    { value: "PROFESSIONAL", label: "Professionnelle" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "EXPIRED", label: "Expirée" },
    { value: "PENDING", label: "En attente" },
  ];

  const benefitOptions = [
    "Consultations médicales",
    "Hospitalisation",
    "Médicaments",
    "Analyses de laboratoire",
    "Radiologie",
    "Chirurgie",
    "Soins dentaires",
    "Soins optiques",
    "Médecine alternative",
    "Transport médical",
    "Rééducation",
    "Prévention",
  ];

  const restrictionOptions = [
    "Exclusions préexistantes",
    "Délai de carence",
    "Limite géographique",
    "Réseau de soins",
    "Autorisation préalable",
    "Franchise annuelle",
    "Plafond de remboursement",
  ];

  // Données mockées pour les sélections
  const mockHolders = [
    { id: 1, name: "Jean Dupont", type: "INDIVIDUAL" },
    { id: 2, name: "Famille Martin", type: "FAMILY" },
    { id: 3, name: "TechCorp Solutions", type: "ENTERPRISE" },
  ];

  const mockInsuranceCompanies = [
    { id: 1, name: "AXA Assurance" },
    { id: 2, name: "Allianz France" },
    { id: 3, name: "Groupama" },
    { id: 4, name: "MAIF" },
    { id: 5, name: "MACIF" },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        holder: initialData.holder || { id: 0, name: "", type: "INDIVIDUAL" },
        insuranceCompany: initialData.insuranceCompany || { id: 0, name: "" },
        coverage: initialData.coverage || {
          type: "",
          amount: "",
          deductible: "",
          coPay: "",
        },
        benefits: initialData.benefits || [],
        restrictions: initialData.restrictions || [],
        emergencyContact: initialData.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
        },
        additionalInfo: initialData.additionalInfo || {
          notes: "",
          specialConditions: "",
          networkProviders: [],
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

    if (name.startsWith("holder.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        holder: {
          ...prev.holder!,
          [field]: field === "id" ? Number(value) : value,
        },
      }));
      if (errors.holder?.[field as keyof typeof errors.holder]) {
        setErrors((prev) => ({
          ...prev,
          holder: { ...prev.holder, [field]: undefined },
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
    } else if (name.startsWith("coverage.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        coverage: {
          ...prev.coverage!,
          [field]: value,
        },
      }));
      if (errors.coverage?.[field as keyof typeof errors.coverage]) {
        setErrors((prev) => ({
          ...prev,
          coverage: { ...prev.coverage, [field]: undefined },
        }));
      }
    } else if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact!,
          [field]: value,
        },
      }));
      if (
        errors.emergencyContact?.[field as keyof typeof errors.emergencyContact]
      ) {
        setErrors((prev) => ({
          ...prev,
          emergencyContact: { ...prev.emergencyContact, [field]: undefined },
        }));
      }
    } else if (name.startsWith("additionalInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo!,
          [field]: value,
        },
      }));
      if (
        errors.additionalInfo?.[field as keyof typeof errors.additionalInfo]
      ) {
        setErrors((prev) => ({
          ...prev,
          additionalInfo: { ...prev.additionalInfo, [field]: undefined },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof InsuranceCardErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBenefitChange = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const handleRestrictionChange = (restriction: string) => {
    setFormData((prev) => ({
      ...prev,
      restrictions: prev.restrictions?.includes(restriction)
        ? prev.restrictions.filter((r) => r !== restriction)
        : [...(prev.restrictions || []), restriction],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: InsuranceCardErrors = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "La date d'émission est requise";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "La date d'expiration est requise";
    }

    if (!formData.holder?.id) {
      newErrors.holder = { ...newErrors.holder, id: "Le titulaire est requis" };
    }

    if (!formData.insuranceCompany?.id) {
      newErrors.insuranceCompany = {
        ...newErrors.insuranceCompany,
        id: "La compagnie d'assurance est requise",
      };
    }

    if (!formData.coverage?.type?.trim()) {
      newErrors.coverage = {
        ...newErrors.coverage,
        type: "Le type de couverture est requis",
      };
    }

    if (!formData.coverage?.amount?.trim()) {
      newErrors.coverage = {
        ...newErrors.coverage,
        amount: "Le montant de couverture est requis",
      };
    }

    // Validation des dates
    if (formData.issueDate && formData.expiryDate) {
      const issueDate = new Date(formData.issueDate);
      const expiryDate = new Date(formData.expiryDate);
      if (issueDate >= expiryDate) {
        newErrors.expiryDate =
          "La date d'expiration doit être postérieure à la date d'émission";
      }
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
      cardNumber: "",
      cardType: "HEALTH",
      status: "ACTIVE",
      issueDate: "",
      expiryDate: "",
      holder: {
        id: 0,
        name: "",
        type: "INDIVIDUAL",
      },
      insuranceCompany: {
        id: 0,
        name: "",
      },
      coverage: {
        type: "",
        amount: "",
        deductible: "",
        coPay: "",
      },
      benefits: [],
      restrictions: [],
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      additionalInfo: {
        notes: "",
        specialConditions: "",
        networkProviders: [],
      },
      isActive: true,
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
            {mode === "create"
              ? "Nouvelle Carte d'Assurance"
              : "Modifier la Carte"}
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
                  placeholder="Numéro de carte d'assurance"
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Type de carte *
                </label>
                <select
                  name="cardType"
                  value={formData.cardType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                >
                  {cardTypeOptions.map((option) => (
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
                  Date d'émission *
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.issueDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.issueDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.issueDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Date d'expiration *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.expiryDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Titulaire et Compagnie */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Titulaire et Compagnie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Titulaire *
                </label>
                <select
                  name="holder.id"
                  value={formData.holder?.id || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.holder?.id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                >
                  <option value="">Sélectionner un titulaire</option>
                  {mockHolders.map((holder) => (
                    <option key={holder.id} value={holder.id}>
                      {holder.name} ({holder.type})
                    </option>
                  ))}
                </select>
                {errors.holder?.id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.holder.id}
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
            </div>
          </div>

          {/* Couverture */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Couverture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Type de couverture *
                </label>
                <input
                  type="text"
                  name="coverage.type"
                  value={formData.coverage?.type || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.coverage?.type
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: Couverture complète"
                />
                {errors.coverage?.type && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.coverage.type}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Montant de couverture *
                </label>
                <input
                  type="text"
                  name="coverage.amount"
                  value={formData.coverage?.amount || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.coverage?.amount
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 100,000 €"
                />
                {errors.coverage?.amount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.coverage.amount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Franchise
                </label>
                <input
                  type="text"
                  name="coverage.deductible"
                  value={formData.coverage?.deductible || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 500 €"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Participation
                </label>
                <input
                  type="text"
                  name="coverage.coPay"
                  value={formData.coverage?.coPay || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 20%"
                />
              </div>
            </div>
          </div>

          {/* Prestations */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Prestations Incluses
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {benefitOptions.map((benefit) => (
                <label key={benefit} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.benefits.includes(benefit)}
                    onChange={() => handleBenefitChange(benefit)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {benefit}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Restrictions et Exclusions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restrictionOptions.map((restriction) => (
                <label
                  key={restriction}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={
                      formData.restrictions?.includes(restriction) || false
                    }
                    onChange={() => handleRestrictionChange(restriction)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {restriction}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact d'urgence */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Contact d'Urgence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact?.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Nom du contact"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact?.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Relation
                </label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact?.relationship || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: Époux, Parent"
                />
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Informations Supplémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Notes
                </label>
                <textarea
                  name="additionalInfo.notes"
                  value={formData.additionalInfo?.notes || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Notes additionnelles..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Conditions spéciales
                </label>
                <textarea
                  name="additionalInfo.specialConditions"
                  value={formData.additionalInfo?.specialConditions || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Conditions spéciales..."
                />
              </div>
            </div>
          </div>

          {/* Statut actif */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-black dark:text-white">
                Carte active
              </span>
            </label>
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
