"use client";

import { useState, useEffect } from "react";

interface Enterprise {
  id?: number;
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  industry: string;
  size: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";
  foundedYear: number;
  numberOfEmployees: number;
  annualRevenue?: string;
  contactPerson: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  insuranceInfo: {
    policyNumber?: string;
    coverageType: string;
    startDate: string;
    endDate: string;
    premium: string;
  };
  isActive: boolean;
}

interface EnterpriseErrors {
  name?: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  email?: string;
  phone?: string;
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
  insuranceInfo?: {
    policyNumber?: string;
    coverageType?: string;
    startDate?: string;
    endDate?: string;
    premium?: string;
  };
  isActive?: string;
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
    name: "",
    legalName: "",
    registrationNumber: "",
    taxId: "",
    email: "",
    phone: "",
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
    insuranceInfo: {
      policyNumber: "",
      coverageType: "BASIC",
      startDate: "",
      endDate: "",
      premium: "",
    },
    isActive: true,
  });

  const [errors, setErrors] = useState<EnterpriseErrors>({});

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
        insuranceInfo: initialData.insuranceInfo || {
          policyNumber: "",
          coverageType: "BASIC",
          startDate: "",
          endDate: "",
          premium: "",
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
    } else if (name.startsWith("insuranceInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        insuranceInfo: {
          ...prev.insuranceInfo!,
          [field]: value,
        },
      }));
      if (errors.insuranceInfo?.[field as keyof typeof errors.insuranceInfo]) {
        setErrors((prev) => ({
          ...prev,
          insuranceInfo: { ...prev.insuranceInfo, [field]: undefined },
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
    if (errors[name as keyof EnterpriseErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: EnterpriseErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de l'entreprise est requis";
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

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
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

    // Validation informations d'assurance
    const insuranceErrors: any = {};
    if (!formData.insuranceInfo?.startDate) {
      insuranceErrors.startDate = "La date de début est requise";
    }
    if (!formData.insuranceInfo?.endDate) {
      insuranceErrors.endDate = "La date de fin est requise";
    }
    if (!formData.insuranceInfo?.premium?.trim()) {
      insuranceErrors.premium = "La prime est requise";
    }

    if (Object.keys(insuranceErrors).length > 0) {
      newErrors.insuranceInfo = insuranceErrors;
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
      phone: "",
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
      insuranceInfo: {
        policyNumber: "",
        coverageType: "BASIC",
        startDate: "",
        endDate: "",
        premium: "",
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
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
                  placeholder="email@entreprise.com"
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
                  placeholder="Téléphone"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
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
                  placeholder="https://www.entreprise.com"
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
                  <option value="SMALL">Petite (1-50 employés)</option>
                  <option value="MEDIUM">Moyenne (51-250 employés)</option>
                  <option value="LARGE">Grande (251-1000 employés)</option>
                  <option value="ENTERPRISE">
                    Entreprise (1000+ employés)
                  </option>
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
                  placeholder="ex: 1,000,000 €"
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
                  placeholder="email@entreprise.com"
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

          {/* Informations d'assurance */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Informations d'Assurance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  N° de police
                </label>
                <input
                  type="text"
                  name="insuranceInfo.policyNumber"
                  value={formData.insuranceInfo?.policyNumber || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Numéro de police"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Type de couverture
                </label>
                <select
                  name="insuranceInfo.coverageType"
                  value={formData.insuranceInfo?.coverageType || "BASIC"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                >
                  <option value="BASIC">Couverture de base</option>
                  <option value="STANDARD">Couverture standard</option>
                  <option value="PREMIUM">Couverture premium</option>
                  <option value="CUSTOM">Couverture personnalisée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Date de début *
                </label>
                <input
                  type="date"
                  name="insuranceInfo.startDate"
                  value={formData.insuranceInfo?.startDate || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.insuranceInfo?.startDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.insuranceInfo?.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.insuranceInfo.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Date de fin *
                </label>
                <input
                  type="date"
                  name="insuranceInfo.endDate"
                  value={formData.insuranceInfo?.endDate || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.insuranceInfo?.endDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.insuranceInfo?.endDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.insuranceInfo.endDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Prime *
                </label>
                <input
                  type="text"
                  name="insuranceInfo.premium"
                  value={formData.insuranceInfo?.premium || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.insuranceInfo?.premium
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 5,000 €/an"
                />
                {errors.insuranceInfo?.premium && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.insuranceInfo.premium}
                  </p>
                )}
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
                Entreprise active
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
