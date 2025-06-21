"use client";

import { useState, useEffect } from "react";
import { InsuranceCompany } from "../../types/insurance-company";

interface InsuranceCompanyErrors {
  name?: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  email?: string;
  phone1?: string;
  phone2?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  industry?: string;
  size?: string;
  foundedYear?: string;
  numberOfEmployees?: string;
  annualRevenue?: string;
  contactPerson?: {
    name?: string;
    position?: string;
    email?: string;
    phone?: string;
  };
  financialInfo?: {
    capital?: string;
    turnover?: string;
    rating?: string;
    solvencyRatio?: string;
  };
  coverageTypes?: string;
  isActive?: string;
}

interface InsuranceCompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsuranceCompany) => void;
  initialData?: InsuranceCompany;
  mode: "create" | "edit";
}

export function InsuranceCompanyForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: InsuranceCompanyFormProps) {
  const [formData, setFormData] = useState<InsuranceCompany>({
    name: "",
    legalName: "",
    registrationNumber: "",
    taxId: "",
    email: "",
    phone1: "",
    phone2: "",
    website: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    industry: "",
    size: "MEDIUM",
    foundedYear: 0,
    numberOfEmployees: 0,
    annualRevenue: "",
    contactPerson: {
      name: "",
      position: "",
      email: "",
      phone: "",
    },
    financialInfo: {
      capital: "",
      turnover: "",
      rating: "A",
      solvencyRatio: "",
    },
    coverageTypes: [],
    isActive: true,
  });

  const [errors, setErrors] = useState<InsuranceCompanyErrors>({});

  const sizeOptions = [
    { value: "SMALL", label: "Petite (1-50 employés)" },
    { value: "MEDIUM", label: "Moyenne (51-250 employés)" },
    { value: "LARGE", label: "Grande (251-1000 employés)" },
    { value: "ENTERPRISE", label: "Entreprise (1000+ employés)" },
  ];

  const ratingOptions = [
    { value: "AAA", label: "AAA - Excellente" },
    { value: "AA", label: "AA - Très bonne" },
    { value: "A", label: "A - Bonne" },
    { value: "BBB", label: "BBB - Satisfaisante" },
    { value: "BB", label: "BB - Spéculative" },
    { value: "B", label: "B - Très spéculative" },
    { value: "CCC", label: "CCC - Extrêmement spéculative" },
    { value: "CC", label: "CC - Défaut probable" },
    { value: "C", label: "C - Défaut imminent" },
  ];

  const coverageTypeOptions = [
    "Assurance automobile",
    "Assurance habitation",
    "Assurance vie",
    "Assurance santé",
    "Assurance voyage",
    "Assurance professionnelle",
    "Assurance responsabilité civile",
    "Assurance décès",
    "Assurance invalidité",
    "Assurance retraite",
    "Assurance crédit",
    "Assurance agricole",
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        contactPerson: initialData.contactPerson || {
          name: "",
          position: "",
          email: "",
          phone: "",
        },
        financialInfo: initialData.financialInfo || {
          capital: "",
          turnover: "",
          rating: "A",
          solvencyRatio: "",
        },
        coverageTypes: initialData.coverageTypes || [],
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

    if (name.startsWith("contactPerson.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson!,
          [field]: value,
        },
      }));
      if (errors.contactPerson?.[field as keyof typeof errors.contactPerson]) {
        setErrors((prev) => ({
          ...prev,
          contactPerson: { ...prev.contactPerson, [field]: undefined },
        }));
      }
    } else if (name.startsWith("financialInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        financialInfo: {
          ...prev.financialInfo!,
          [field]: value,
        },
      }));
      if (errors.financialInfo?.[field as keyof typeof errors.financialInfo]) {
        setErrors((prev) => ({
          ...prev,
          financialInfo: { ...prev.financialInfo, [field]: undefined },
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
    if (errors[name as keyof InsuranceCompanyErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCoverageTypeChange = (coverageType: string) => {
    setFormData((prev) => ({
      ...prev,
      coverageTypes: prev.coverageTypes.includes(coverageType)
        ? prev.coverageTypes.filter((type) => type !== coverageType)
        : [...prev.coverageTypes, coverageType],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: InsuranceCompanyErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la compagnie est requis";
    }

    if (!formData.legalName.trim()) {
      newErrors.legalName = "Le nom légal est requis";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Le numéro d'enregistrement est requis";
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = "Le numéro de taxe est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone1.trim()) {
      newErrors.phone1 = "Le téléphone principal est requis";
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

    if (!formData.industry.trim()) {
      newErrors.industry = "Le secteur d'activité est requis";
    }

    if (!formData.foundedYear || formData.foundedYear <= 0) {
      newErrors.foundedYear = "L'année de création est requise";
    }

    if (formData.numberOfEmployees <= 0) {
      newErrors.numberOfEmployees =
        "Le nombre d'employés doit être supérieur à 0";
    }

    // Validation contact principal
    const contactErrors: any = {};
    if (!formData.contactPerson?.name?.trim()) {
      contactErrors.name = "Le nom du contact principal est requis";
    }
    if (!formData.contactPerson?.position?.trim()) {
      contactErrors.position = "Le poste du contact est requis";
    }
    if (!formData.contactPerson?.email?.trim()) {
      contactErrors.email = "L'email du contact est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactPerson.email)) {
      contactErrors.email = "Format d'email invalide pour le contact";
    }
    if (!formData.contactPerson?.phone?.trim()) {
      contactErrors.phone = "Le téléphone du contact est requis";
    }

    if (Object.keys(contactErrors).length > 0) {
      newErrors.contactPerson = contactErrors;
    }

    // Validation informations financières
    const financialErrors: any = {};
    if (!formData.financialInfo?.capital?.trim()) {
      financialErrors.capital = "Le capital social est requis";
    }
    if (!formData.financialInfo?.turnover?.trim()) {
      financialErrors.turnover = "Le chiffre d'affaires est requis";
    }
    if (!formData.financialInfo?.solvencyRatio?.trim()) {
      financialErrors.solvencyRatio = "Le ratio de solvabilité est requis";
    }

    if (Object.keys(financialErrors).length > 0) {
      newErrors.financialInfo = financialErrors;
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
      legalName: "",
      registrationNumber: "",
      taxId: "",
      email: "",
      phone1: "",
      phone2: "",
      website: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      industry: "",
      size: "MEDIUM",
      foundedYear: 0,
      numberOfEmployees: 0,
      annualRevenue: "",
      contactPerson: {
        name: "",
        position: "",
        email: "",
        phone: "",
      },
      financialInfo: {
        capital: "",
        turnover: "",
        rating: "A",
        solvencyRatio: "",
      },
      coverageTypes: [],
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
              ? "Nouvelle Compagnie d'Assurance"
              : "Modifier la Compagnie"}
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
                  placeholder="Nom commercial"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nom légal *
                </label>
                <input
                  type="text"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.legalName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Nom légal complet"
                />
                {errors.legalName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.legalName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  N° d'enregistrement *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.registrationNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Numéro d'enregistrement"
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.registrationNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  N° de taxe *
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.taxId
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Numéro de taxe"
                />
                {errors.taxId && (
                  <p className="mt-1 text-sm text-red-500">{errors.taxId}</p>
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
                  placeholder="email@compagnie.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Téléphone principal *
                </label>
                <input
                  type="tel"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone1
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Téléphone principal"
                />
                {errors.phone1 && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Téléphone secondaire
                </label>
                <input
                  type="tel"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Téléphone secondaire"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="https://www.compagnie.com"
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Adresse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Adresse complète *
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
                  <p className="mt-1 text-sm text-red-500">
                    {errors.postalCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Pays
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Pays"
                />
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Informations Professionnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Secteur d'activité *
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.industry
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Secteur d'activité"
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Taille de l'entreprise *
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                >
                  {sizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Année de création *
                </label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.foundedYear
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Année de création"
                />
                {errors.foundedYear && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.foundedYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nombre d'employés *
                </label>
                <input
                  type="number"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.numberOfEmployees
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Nombre d'employés"
                />
                {errors.numberOfEmployees && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.numberOfEmployees}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Chiffre d'affaires annuel
                </label>
                <input
                  type="text"
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 10,000,000 €"
                />
              </div>
            </div>
          </div>

          {/* Contact principal */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Contact Principal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="contactPerson.name"
                  value={formData.contactPerson?.name || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.contactPerson?.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Nom du contact"
                />
                {errors.contactPerson?.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactPerson.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Poste *
                </label>
                <input
                  type="text"
                  name="contactPerson.position"
                  value={formData.contactPerson?.position || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.contactPerson?.position
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Poste du contact"
                />
                {errors.contactPerson?.position && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactPerson.position}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="contactPerson.email"
                  value={formData.contactPerson?.email || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.contactPerson?.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="email@compagnie.com"
                />
                {errors.contactPerson?.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactPerson.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="contactPerson.phone"
                  value={formData.contactPerson?.phone || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.contactPerson?.phone
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="Téléphone du contact"
                />
                {errors.contactPerson?.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactPerson.phone}
                  </p>
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
                  Capital social *
                </label>
                <input
                  type="text"
                  name="financialInfo.capital"
                  value={formData.financialInfo?.capital || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.financialInfo?.capital
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 5,000,000 €"
                />
                {errors.financialInfo?.capital && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.financialInfo.capital}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Chiffre d'affaires *
                </label>
                <input
                  type="text"
                  name="financialInfo.turnover"
                  value={formData.financialInfo?.turnover || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.financialInfo?.turnover
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 50,000,000 €"
                />
                {errors.financialInfo?.turnover && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.financialInfo.turnover}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Note de solvabilité
                </label>
                <select
                  name="financialInfo.rating"
                  value={formData.financialInfo?.rating || "A"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                >
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Ratio de solvabilité *
                </label>
                <input
                  type="text"
                  name="financialInfo.solvencyRatio"
                  value={formData.financialInfo?.solvencyRatio || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.financialInfo?.solvencyRatio
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 150%"
                />
                {errors.financialInfo?.solvencyRatio && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.financialInfo.solvencyRatio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Types de couverture */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Types de Couverture Proposés
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {coverageTypeOptions.map((coverageType) => (
                <label
                  key={coverageType}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.coverageTypes.includes(coverageType)}
                    onChange={() => handleCoverageTypeChange(coverageType)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {coverageType}
                  </span>
                </label>
              ))}
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
                Compagnie active
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
