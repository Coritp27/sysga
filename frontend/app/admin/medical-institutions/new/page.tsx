"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MedicalInstitutionFormData {
  name: string;
  code: string;
  type:
    | "HOSPITAL"
    | "CLINIC"
    | "LABORATORY"
    | "PHARMACY"
    | "REHABILITATION"
    | "MENTAL_HEALTH"
    | "OTHER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  category: "PUBLIC" | "PRIVATE" | "NON_PROFIT";
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
  medicalInfo: {
    specialties: string[];
    services: string[];
    accreditation: string;
    licenseNumber: string;
    capacity: string;
    emergencyServices: boolean;
    insuranceAccepted: string[];
  };
  staffInfo: {
    doctors: string;
    nurses: string;
    specialists: string;
    supportStaff: string;
  };
  financialInfo: {
    annualBudget: string;
    insurancePartners: string[];
    paymentMethods: string[];
  };
  additionalInfo: string;
}

const typeOptions = [
  { value: "HOSPITAL", label: "Hôpital" },
  { value: "CLINIC", label: "Clinique" },
  { value: "LABORATORY", label: "Laboratoire" },
  { value: "PHARMACY", label: "Pharmacie" },
  { value: "REHABILITATION", label: "Centre de rééducation" },
  { value: "MENTAL_HEALTH", label: "Centre de santé mentale" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspendue" },
];

const categoryOptions = [
  { value: "PUBLIC", label: "Publique" },
  { value: "PRIVATE", label: "Privée" },
  { value: "NON_PROFIT", label: "À but non lucratif" },
];

const specialtyOptions = [
  "Cardiologie",
  "Dermatologie",
  "Endocrinologie",
  "Gastroentérologie",
  "Gynécologie",
  "Hématologie",
  "Infectiologie",
  "Médecine interne",
  "Néphrologie",
  "Neurologie",
  "Oncologie",
  "Ophtalmologie",
  "Orthopédie",
  "Oto-rhino-laryngologie",
  "Pédiatrie",
  "Pneumologie",
  "Psychiatrie",
  "Radiologie",
  "Rhumatologie",
  "Urologie",
  "Chirurgie générale",
  "Chirurgie cardiaque",
  "Chirurgie orthopédique",
  "Chirurgie plastique",
  "Urgences",
  "Soins intensifs",
  "Médecine préventive",
  "Médecine du travail",
  "Gériatrie",
  "Palliatifs",
];

const serviceOptions = [
  "Consultations externes",
  "Hospitalisation",
  "Chirurgie",
  "Imagerie médicale",
  "Analyses de laboratoire",
  "Rééducation",
  "Soins infirmiers",
  "Pharmacie",
  "Urgences 24h/24",
  "Ambulance",
  "Télémedecine",
  "Prévention",
  "Éducation thérapeutique",
  "Accompagnement social",
  "Nutrition",
  "Psychologie",
  "Kinésithérapie",
  "Ergothérapie",
  "Orthophonie",
  "Podologie",
];

const insuranceOptions = [
  "Sécurité Sociale",
  "Mutuelle Générale",
  "AXA Santé",
  "Allianz Santé",
  "Groupama",
  "MAIF Santé",
  "MACIF Santé",
  "MGEN",
  "Harmonie Mutuelle",
  "Malakoff Humanis",
  "Swiss Life",
  "Generali",
  "Autre",
];

const paymentMethodOptions = [
  "Carte bancaire",
  "Espèces",
  "Chèque",
  "Virement bancaire",
  "Prélèvement automatique",
  "Tiers payant",
  "Paiement en ligne",
];

export default function NewMedicalInstitutionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<MedicalInstitutionFormData>({
    name: "",
    code: "",
    type: "HOSPITAL",
    status: "ACTIVE",
    category: "PUBLIC",
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
    medicalInfo: {
      specialties: [],
      services: [],
      accreditation: "",
      licenseNumber: "",
      capacity: "",
      emergencyServices: false,
      insuranceAccepted: [],
    },
    staffInfo: {
      doctors: "",
      nurses: "",
      specialists: "",
      supportStaff: "",
    },
    financialInfo: {
      annualBudget: "",
      insurancePartners: [],
      paymentMethods: [],
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
    medicalInfo?: {
      licenseNumber?: string;
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
    } else if (name.startsWith("medicalInfo.")) {
      const field = name.split(".")[1];
      if (
        field === "specialties" ||
        field === "services" ||
        field === "insuranceAccepted"
      ) {
        setFormData((prev) => ({
          ...prev,
          medicalInfo: {
            ...prev.medicalInfo,
            [field]: checked
              ? [
                  ...(prev.medicalInfo[
                    field as keyof typeof prev.medicalInfo
                  ] as string[]),
                  value,
                ]
              : (
                  prev.medicalInfo[
                    field as keyof typeof prev.medicalInfo
                  ] as string[]
                ).filter((item) => item !== value),
          },
        }));
      } else if (field === "emergencyServices") {
        setFormData((prev) => ({
          ...prev,
          medicalInfo: { ...prev.medicalInfo, emergencyServices: checked },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          medicalInfo: { ...prev.medicalInfo, [field]: value },
        }));
      }
      if (errors.medicalInfo?.[field as keyof typeof errors.medicalInfo]) {
        setErrors((prev) => ({
          ...prev,
          medicalInfo: { ...prev.medicalInfo, [field]: undefined },
        }));
      }
    } else if (name.startsWith("staffInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        staffInfo: { ...prev.staffInfo, [field]: value },
      }));
    } else if (name.startsWith("financialInfo.")) {
      const field = name.split(".")[1];
      if (field === "insurancePartners" || field === "paymentMethods") {
        setFormData((prev) => ({
          ...prev,
          financialInfo: {
            ...prev.financialInfo,
            [field]: checked
              ? [
                  ...(prev.financialInfo[
                    field as keyof typeof prev.financialInfo
                  ] as string[]),
                  value,
                ]
              : (
                  prev.financialInfo[
                    field as keyof typeof prev.financialInfo
                  ] as string[]
                ).filter((item) => item !== value),
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          financialInfo: { ...prev.financialInfo, [field]: value },
        }));
      }
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

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      code?: string;
      contactInfo?: {
        email?: string;
        phone?: string;
      };
      medicalInfo?: {
        licenseNumber?: string;
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

    if (
      formData.medicalInfo.licenseNumber &&
      !/^[A-Z0-9\-]{5,}$/.test(formData.medicalInfo.licenseNumber)
    ) {
      newErrors.medicalInfo = {
        ...newErrors.medicalInfo,
        licenseNumber: "Numéro de licence invalide",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ici, vous pouvez ajouter la logique pour sauvegarder l'institution médicale
    console.log("Nouvelle institution médicale:", formData);

    // Redirection vers la liste des institutions médicales
    router.push("/admin/medical-institutions");
  };

  const handleCancel = () => {
    router.push("/admin/medical-institutions");
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
            Nouvelle Institution Médicale
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
                placeholder="ex: Hôpital Central de Paris"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Code de l'institution *
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
                placeholder="ex: HCP001"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type d'institution
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
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                {categoryOptions.map((option) => (
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
                placeholder="contact@institution.com"
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
                placeholder="https://www.institution.com"
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
                  placeholder="ex: 123 Rue de la Santé"
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

        {/* Informations médicales */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations Médicales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Numéro de licence
              </label>
              <input
                type="text"
                name="medicalInfo.licenseNumber"
                value={formData.medicalInfo.licenseNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.medicalInfo?.licenseNumber
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: LIC-2024-001"
              />
              {errors.medicalInfo?.licenseNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.medicalInfo.licenseNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Accréditation
              </label>
              <input
                type="text"
                name="medicalInfo.accreditation"
                value={formData.medicalInfo.accreditation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: HAS, ISO 9001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Capacité d'accueil
              </label>
              <input
                type="text"
                name="medicalInfo.capacity"
                value={formData.medicalInfo.capacity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 200 lits, 50 consultations/jour"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="medicalInfo.emergencyServices"
                  checked={formData.medicalInfo.emergencyServices}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-black dark:text-white">
                  Services d'urgence disponibles
                </span>
              </label>
            </div>
          </div>

          {/* Spécialités */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Spécialités médicales
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specialtyOptions.map((specialty) => (
                <label key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalInfo.specialties"
                    value={specialty}
                    checked={formData.medicalInfo.specialties.includes(
                      specialty
                    )}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {specialty}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Services proposés
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {serviceOptions.map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalInfo.services"
                    value={service}
                    checked={formData.medicalInfo.services.includes(service)}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {service}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Assurances acceptées */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Assurances acceptées
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insuranceOptions.map((insurance) => (
                <label key={insurance} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalInfo.insuranceAccepted"
                    value={insurance}
                    checked={formData.medicalInfo.insuranceAccepted.includes(
                      insurance
                    )}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {insurance}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Informations sur le personnel */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Personnel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nombre de médecins
              </label>
              <input
                type="number"
                name="staffInfo.doctors"
                value={formData.staffInfo.doctors}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 25"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nombre d'infirmiers
              </label>
              <input
                type="number"
                name="staffInfo.nurses"
                value={formData.staffInfo.nurses}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nombre de spécialistes
              </label>
              <input
                type="number"
                name="staffInfo.specialists"
                value={formData.staffInfo.specialists}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 15"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Personnel de soutien
              </label>
              <input
                type="number"
                name="staffInfo.supportStaff"
                value={formData.staffInfo.supportStaff}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 30"
                min="0"
              />
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
                Budget annuel
              </label>
              <input
                type="text"
                name="financialInfo.annualBudget"
                value={formData.financialInfo.annualBudget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 10,000,000 €"
              />
            </div>
          </div>

          {/* Partenaires d'assurance */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Partenaires d'assurance
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insuranceOptions.map((insurance) => (
                <label key={insurance} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="financialInfo.insurancePartners"
                    value={insurance}
                    checked={formData.financialInfo.insurancePartners.includes(
                      insurance
                    )}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {insurance}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Méthodes de paiement acceptées
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethodOptions.map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="financialInfo.paymentMethods"
                    value={method}
                    checked={formData.financialInfo.paymentMethods.includes(
                      method
                    )}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {method}
                  </span>
                </label>
              ))}
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
            Créer l'Institution
          </button>
        </div>
      </form>
    </div>
  );
}
