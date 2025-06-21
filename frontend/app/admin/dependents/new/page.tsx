"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DependentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  relationship: "CHILD" | "SPOUSE" | "PARENT" | "OTHER";
  isActive: boolean;
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  policyNumber: string;
  coverageDetails: {
    type: string;
    description: string;
    limits: string;
  };
  medicalInfo: {
    bloodType: string;
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  additionalInfo: string;
}

const genderOptions = [
  { value: "MALE", label: "Homme" },
  { value: "FEMALE", label: "Femme" },
  { value: "OTHER", label: "Autre" },
];

const relationshipOptions = [
  { value: "CHILD", label: "Enfant" },
  { value: "SPOUSE", label: "Conjoint" },
  { value: "PARENT", label: "Parent" },
  { value: "OTHER", label: "Autre" },
];

const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const allergyOptions = [
  "Pénicilline",
  "Aspirine",
  "Latex",
  "Arachides",
  "Lactose",
  "Gluten",
  "Poussière",
  "Pollen",
  "Aucune",
];

const conditionOptions = [
  "Diabète",
  "Hypertension",
  "Asthme",
  "Maladie cardiaque",
  "Cancer",
  "VIH/SIDA",
  "Aucune",
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

export default function NewDependentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DependentFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "MALE",
    relationship: "CHILD",
    isActive: true,
    insuredPerson: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
    },
    policyNumber: "",
    coverageDetails: {
      type: "",
      description: "",
      limits: "",
    },
    medicalInfo: {
      bloodType: "",
      allergies: [],
      conditions: [],
      medications: [],
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    insuredPerson?: {
      id?: string;
    };
    policyNumber?: string;
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
    } else if (name.startsWith("coverageDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        coverageDetails: { ...prev.coverageDetails, [field]: value },
      }));
    } else if (name.startsWith("medicalInfo.")) {
      const field = name.split(".")[1];
      if (field === "allergies" || field === "conditions") {
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
      } else {
        setFormData((prev) => ({
          ...prev,
          medicalInfo: { ...prev.medicalInfo, [field]: value },
        }));
      }
    } else if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
    } else if (name === "isActive") {
      setFormData((prev) => ({
        ...prev,
        isActive: checked,
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

  const validateForm = (): boolean => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      insuredPerson?: {
        id?: string;
      };
      policyNumber?: string;
    } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    }

    if (!formData.insuredPerson.id) {
      newErrors.insuredPerson = {
        ...newErrors.insuredPerson,
        id: "La personne assurée est requise",
      };
    }

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "Le numéro de police est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ici, vous pouvez ajouter la logique pour sauvegarder le dépendant
    console.log("Nouveau dépendant:", formData);

    // Redirection vers la liste des dépendants
    router.push("/admin/dependents");
  };

  const handleCancel = () => {
    router.push("/admin/dependents");
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
            Nouveau Dépendant
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
                Relation
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                {relationshipOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-black dark:text-white">
                  Actif
                </span>
              </label>
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
                Personne assurée principale *
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
                Type de couverture
              </label>
              <input
                type="text"
                name="coverageDetails.type"
                value={formData.coverageDetails.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: Couverture familiale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Limites de couverture
              </label>
              <input
                type="text"
                name="coverageDetails.limits"
                value={formData.coverageDetails.limits}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 50,000 € par an"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description de la couverture
              </label>
              <textarea
                name="coverageDetails.description"
                value={formData.coverageDetails.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Description détaillée de la couverture..."
              />
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
                Groupe sanguin
              </label>
              <select
                name="medicalInfo.bloodType"
                value={formData.medicalInfo.bloodType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner</option>
                {bloodTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Médicaments actuels
              </label>
              <input
                type="text"
                name="medicalInfo.medications"
                value={formData.medicalInfo.medications.join(", ")}
                onChange={(e) => {
                  const medications = e.target.value
                    .split(",")
                    .map((m) => m.trim())
                    .filter((m) => m);
                  setFormData((prev) => ({
                    ...prev,
                    medicalInfo: { ...prev.medicalInfo, medications },
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Séparés par des virgules"
              />
            </div>
          </div>

          {/* Allergies */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Allergies
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allergyOptions.map((allergy) => (
                <label key={allergy} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalInfo.allergies"
                    value={allergy}
                    checked={formData.medicalInfo.allergies.includes(allergy)}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {allergy}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditions médicales */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Conditions médicales
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conditionOptions.map((condition) => (
                <label key={condition} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalInfo.conditions"
                    value={condition}
                    checked={formData.medicalInfo.conditions.includes(
                      condition
                    )}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {condition}
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
                placeholder="ex: Parent, Tuteur, etc."
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
            Créer le Dépendant
          </button>
        </div>
      </form>
    </div>
  );
}
