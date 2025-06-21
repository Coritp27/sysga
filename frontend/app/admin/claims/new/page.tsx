"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClaimFormData {
  claimNumber: string;
  type:
    | "HEALTH"
    | "AUTO"
    | "PROPERTY"
    | "LIFE"
    | "TRAVEL"
    | "PROFESSIONAL"
    | "OTHER";
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "PAID" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  policy: {
    id: number;
    number: string;
    type: string;
  };
  insuranceCompany: {
    id: number;
    name: string;
    code: string;
  };
  incidentDetails: {
    date: string;
    time: string;
    location: string;
    description: string;
    witnesses: string;
    policeReport: string;
  };
  damages: {
    estimatedAmount: string;
    actualAmount: string;
    currency: string;
    description: string;
  };
  documents: {
    name: string;
    type: string;
    uploaded: boolean;
  }[];
  assignee: {
    id: number;
    name: string;
    email: string;
  };
  timeline: {
    date: string;
    action: string;
    notes: string;
  }[];
  additionalInfo: string;
}

const typeOptions = [
  { value: "HEALTH", label: "Santé" },
  { value: "AUTO", label: "Automobile" },
  { value: "PROPERTY", label: "Propriété" },
  { value: "LIFE", label: "Vie" },
  { value: "TRAVEL", label: "Voyage" },
  { value: "PROFESSIONAL", label: "Professionnelle" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "IN_REVIEW", label: "En cours d'examen" },
  { value: "APPROVED", label: "Approuvé" },
  { value: "REJECTED", label: "Rejeté" },
  { value: "PAID", label: "Payé" },
  { value: "CLOSED", label: "Fermé" },
];

const priorityOptions = [
  { value: "LOW", label: "Faible" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Élevée" },
  { value: "URGENT", label: "Urgente" },
];

const currencyOptions = ["EUR", "USD", "GBP", "CHF", "CAD", "AUD", "JPY"];

const documentTypeOptions = [
  "Police report",
  "Medical certificate",
  "Invoice",
  "Photo",
  "Video",
  "Witness statement",
  "Insurance policy",
  "Other",
];

const mockInsuredPersons = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@email.com",
  },
  {
    id: 3,
    firstName: "Pierre",
    lastName: "Durand",
    email: "pierre.durand@email.com",
  },
  {
    id: 4,
    firstName: "Sophie",
    lastName: "Leroy",
    email: "sophie.leroy@email.com",
  },
  {
    id: 5,
    firstName: "Lucas",
    lastName: "Moreau",
    email: "lucas.moreau@email.com",
  },
];

const mockPolicies = [
  { id: 1, number: "POL-2024-001", type: "Assurance automobile" },
  { id: 2, number: "POL-2024-002", type: "Assurance santé" },
  { id: 3, number: "POL-2024-003", type: "Assurance habitation" },
  { id: 4, number: "POL-2024-004", type: "Assurance vie" },
  { id: 5, number: "POL-2024-005", type: "Assurance voyage" },
];

const mockInsuranceCompanies = [
  { id: 1, name: "AXA Assurance", code: "AXA001" },
  { id: 2, name: "Allianz", code: "ALL002" },
  { id: 3, name: "Groupama", code: "GRP003" },
  { id: 4, name: "MAIF", code: "MAI004" },
  { id: 5, name: "MACIF", code: "MAC005" },
];

const mockAssignees = [
  { id: 1, name: "Thomas Dubois", email: "thomas.dubois@company.com" },
  { id: 2, name: "Sarah Bernard", email: "sarah.bernard@company.com" },
  { id: 3, name: "Michel Rousseau", email: "michel.rousseau@company.com" },
  { id: 4, name: "Julie Moreau", email: "julie.moreau@company.com" },
  { id: 5, name: "David Girard", email: "david.girard@company.com" },
];

export default function NewClaimPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClaimFormData>({
    claimNumber: "",
    type: "AUTO",
    status: "PENDING",
    priority: "MEDIUM",
    insuredPerson: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
    },
    policy: {
      id: 0,
      number: "",
      type: "",
    },
    insuranceCompany: {
      id: 0,
      name: "",
      code: "",
    },
    incidentDetails: {
      date: "",
      time: "",
      location: "",
      description: "",
      witnesses: "",
      policeReport: "",
    },
    damages: {
      estimatedAmount: "",
      actualAmount: "",
      currency: "EUR",
      description: "",
    },
    documents: [
      {
        name: "",
        type: "Police report",
        uploaded: false,
      },
    ],
    assignee: {
      id: 0,
      name: "",
      email: "",
    },
    timeline: [
      {
        date: new Date().toISOString().split("T")[0],
        action: "Création du sinistre",
        notes: "Sinistre créé par l'utilisateur",
      },
    ],
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<{
    claimNumber?: string;
    insuredPerson?: {
      id?: string;
    };
    policy?: {
      id?: string;
    };
    insuranceCompany?: {
      id?: string;
    };
    incidentDetails?: {
      date?: string;
      description?: string;
    };
  }>({});

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
          ...prev.insuredPerson,
          [field]: field === "id" ? Number(value) : value,
        },
      }));
      if (errors.insuredPerson?.[field as keyof typeof errors.insuredPerson]) {
        setErrors((prev) => ({
          ...prev,
          insuredPerson: { ...prev.insuredPerson, [field]: undefined },
        }));
      }
    } else if (name.startsWith("policy.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        policy: {
          ...prev.policy,
          [field]: field === "id" ? Number(value) : value,
        },
      }));
      if (errors.policy?.[field as keyof typeof errors.policy]) {
        setErrors((prev) => ({
          ...prev,
          policy: { ...prev.policy, [field]: undefined },
        }));
      }
    } else if (name.startsWith("insuranceCompany.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        insuranceCompany: {
          ...prev.insuranceCompany,
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
    } else if (name.startsWith("incidentDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        incidentDetails: { ...prev.incidentDetails, [field]: value },
      }));
      if (
        errors.incidentDetails?.[field as keyof typeof errors.incidentDetails]
      ) {
        setErrors((prev) => ({
          ...prev,
          incidentDetails: { ...prev.incidentDetails, [field]: undefined },
        }));
      }
    } else if (name.startsWith("damages.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        damages: { ...prev.damages, [field]: value },
      }));
    } else if (name.startsWith("documents.")) {
      const parts = name.split(".");
      const docIndex = parseInt(parts[1]);
      const field = parts[2];
      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.map((doc, index) =>
          index === docIndex ? { ...doc, [field]: value } : doc
        ),
      }));
    } else if (name.startsWith("assignee.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        assignee: {
          ...prev.assignee,
          [field]: field === "id" ? Number(value) : value,
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

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          name: "",
          type: "Police report",
          uploaded: false,
        },
      ],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const addTimelineEntry = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          date: new Date().toISOString().split("T")[0],
          action: "",
          notes: "",
        },
      ],
    }));
  };

  const removeTimelineEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {
      claimNumber?: string;
      insuredPerson?: {
        id?: string;
      };
      policy?: {
        id?: string;
      };
      insuranceCompany?: {
        id?: string;
      };
      incidentDetails?: {
        date?: string;
        description?: string;
      };
    } = {};

    if (!formData.claimNumber.trim()) {
      newErrors.claimNumber = "Le numéro de sinistre est requis";
    }

    if (!formData.insuredPerson.id) {
      newErrors.insuredPerson = {
        ...newErrors.insuredPerson,
        id: "La personne assurée est requise",
      };
    }

    if (!formData.policy.id) {
      newErrors.policy = {
        ...newErrors.policy,
        id: "La police d'assurance est requise",
      };
    }

    if (!formData.insuranceCompany.id) {
      newErrors.insuranceCompany = {
        ...newErrors.insuranceCompany,
        id: "La compagnie d'assurance est requise",
      };
    }

    if (!formData.incidentDetails.date) {
      newErrors.incidentDetails = {
        ...newErrors.incidentDetails,
        date: "La date de l'incident est requise",
      };
    }

    if (!formData.incidentDetails.description.trim()) {
      newErrors.incidentDetails = {
        ...newErrors.incidentDetails,
        description: "La description de l'incident est requise",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ici, vous pouvez ajouter la logique pour sauvegarder le sinistre
    console.log("Nouveau sinistre:", formData);

    // Redirection vers la liste des sinistres
    router.push("/admin/claims");
  };

  const handleCancel = () => {
    router.push("/admin/claims");
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
            Nouveau Sinistre
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
                Numéro de sinistre *
              </label>
              <input
                type="text"
                name="claimNumber"
                value={formData.claimNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.claimNumber
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: CLM-2024-001"
              />
              {errors.claimNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.claimNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type de sinistre
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
                Priorité
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                Personne assurée *
              </label>
              <select
                name="insuredPerson.id"
                value={formData.insuredPerson.id}
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
                Police d'assurance *
              </label>
              <select
                name="policy.id"
                value={formData.policy.id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.policy?.id
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              >
                <option value="">Sélectionner une police</option>
                {mockPolicies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.number} - {policy.type}
                  </option>
                ))}
              </select>
              {errors.policy?.id && (
                <p className="mt-1 text-sm text-red-500">{errors.policy.id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Compagnie d'assurance *
              </label>
              <select
                name="insuranceCompany.id"
                value={formData.insuranceCompany.id}
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
                    {company.name} - {company.code}
                  </option>
                ))}
              </select>
              {errors.insuranceCompany?.id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.insuranceCompany.id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Assigné à
              </label>
              <select
                name="assignee.id"
                value={formData.assignee.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner un assigné</option>
                {mockAssignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name} - {assignee.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Détails de l'incident */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Détails de l'Incident
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Date de l'incident *
              </label>
              <input
                type="date"
                name="incidentDetails.date"
                value={formData.incidentDetails.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.incidentDetails?.date
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              />
              {errors.incidentDetails?.date && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.incidentDetails.date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Heure de l'incident
              </label>
              <input
                type="time"
                name="incidentDetails.time"
                value={formData.incidentDetails.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Lieu de l'incident
              </label>
              <input
                type="text"
                name="incidentDetails.location"
                value={formData.incidentDetails.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 123 Rue de la Paix, Paris"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description de l'incident *
              </label>
              <textarea
                name="incidentDetails.description"
                value={formData.incidentDetails.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.incidentDetails?.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Description détaillée de l'incident..."
              />
              {errors.incidentDetails?.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.incidentDetails.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Témoins
              </label>
              <input
                type="text"
                name="incidentDetails.witnesses"
                value={formData.incidentDetails.witnesses}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Noms et coordonnées des témoins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Numéro de rapport de police
              </label>
              <input
                type="text"
                name="incidentDetails.policeReport"
                value={formData.incidentDetails.policeReport}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: RP-2024-001"
              />
            </div>
          </div>
        </div>

        {/* Dégâts et montants */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Dégâts et Montants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Montant estimé
              </label>
              <input
                type="number"
                name="damages.estimatedAmount"
                value={formData.damages.estimatedAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Montant réel
              </label>
              <input
                type="number"
                name="damages.actualAmount"
                value={formData.damages.actualAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Devise
              </label>
              <select
                name="damages.currency"
                value={formData.damages.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description des dégâts
              </label>
              <textarea
                name="damages.description"
                value={formData.damages.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Description détaillée des dégâts..."
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Documents
            </h3>
            <button
              type="button"
              onClick={addDocument}
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
              Ajouter un document
            </button>
          </div>

          {formData.documents.map((document, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4 dark:border-strokedark"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-black dark:text-white">
                  Document {index + 1}
                </h4>
                {formData.documents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
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
                    Nom du document
                  </label>
                  <input
                    type="text"
                    name={`documents.${index}.name`}
                    value={document.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                    placeholder="ex: Rapport de police"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Type de document
                  </label>
                  <select
                    name={`documents.${index}.type`}
                    value={document.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  >
                    {documentTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`documents.${index}.uploaded`}
                      checked={document.uploaded}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          documents: prev.documents.map((doc, i) =>
                            i === index
                              ? { ...doc, uploaded: e.target.checked }
                              : doc
                          ),
                        }));
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-black dark:text-white">
                      Document téléchargé
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chronologie */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Chronologie
            </h3>
            <button
              type="button"
              onClick={addTimelineEntry}
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
              Ajouter une entrée
            </button>
          </div>

          {formData.timeline.map((entry, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4 dark:border-strokedark"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-black dark:text-white">
                  Entrée {index + 1}
                </h4>
                {formData.timeline.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimelineEntry(index)}
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
                    Date
                  </label>
                  <input
                    type="date"
                    name={`timeline.${index}.date`}
                    value={entry.date}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        timeline: prev.timeline.map((item, i) =>
                          i === index ? { ...item, date: e.target.value } : item
                        ),
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Action
                  </label>
                  <input
                    type="text"
                    name={`timeline.${index}.action`}
                    value={entry.action}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        timeline: prev.timeline.map((item, i) =>
                          i === index
                            ? { ...item, action: e.target.value }
                            : item
                        ),
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                    placeholder="ex: Ouverture du dossier"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    name={`timeline.${index}.notes`}
                    value={entry.notes}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        timeline: prev.timeline.map((item, i) =>
                          i === index
                            ? { ...item, notes: e.target.value }
                            : item
                        ),
                      }));
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                    placeholder="Notes supplémentaires..."
                  />
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
            Créer le Sinistre
          </button>
        </div>
      </form>
    </div>
  );
}
