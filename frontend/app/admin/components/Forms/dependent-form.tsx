"use client";

import { useState, useEffect } from "react";
import { Dependent } from "../../types/dependent";

interface DependentErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  relationship?: string;
  status?: string;
  insuredPerson?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  policyNumber?: string;
  insuranceCardNumber?: string;
  additionalInfo?: {
    notes?: string;
    specialConditions?: string;
    medicalHistory?: string;
  };
  isActive?: string;
}

interface DependentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Dependent) => void;
  initialData?: Dependent;
  mode: "create" | "edit";
}

export function DependentForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: DependentFormProps) {
  const [formData, setFormData] = useState<Dependent>({
    id: 0, // Temporary ID for new dependents
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    relationship: "CHILD",
    status: "ACTIVE",
    insuredPerson: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
    },
    policyNumber: "",
    insuranceCardNumber: "",
    additionalInfo: {
      notes: "",
      specialConditions: "",
      medicalHistory: "",
    },
    isActive: true,
  });

  const [errors, setErrors] = useState<DependentErrors>({});

  const relationshipOptions = [
    { value: "CHILD", label: "Enfant" },
    { value: "SPOUSE", label: "Conjoint" },
    { value: "PARENT", label: "Parent" },
    { value: "OTHER", label: "Autre" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Actif" },
    { value: "INACTIVE", label: "Inactif" },
    { value: "EXPIRED", label: "Expiré" },
  ];

  // Données mockées pour les personnes assurées
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        insuredPerson: initialData.insuredPerson || {
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
        },
        additionalInfo: initialData.additionalInfo || {
          notes: "",
          specialConditions: "",
          medicalHistory: "",
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
    if (name.startsWith("insuredPerson.")) {
      const field = name.split(".")[1];
      if (errors.insuredPerson?.[field as keyof typeof errors.insuredPerson]) {
        setErrors((prev) => ({
          ...prev,
          insuredPerson: { ...prev.insuredPerson, [field]: undefined },
        }));
      }
    } else if (name.startsWith("additionalInfo.")) {
      const field = name.split(".")[1];
      if (
        errors.additionalInfo?.[field as keyof typeof errors.additionalInfo]
      ) {
        setErrors((prev) => ({
          ...prev,
          additionalInfo: { ...prev.additionalInfo, [field]: undefined },
        }));
      }
    } else if (errors[name as keyof DependentErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: DependentErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth =
          "La date de naissance ne peut pas être dans le futur";
      }
    }

    if (!formData.insuredPerson?.id) {
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

    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      id: 0, // Temporary ID for new dependents
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      relationship: "CHILD",
      status: "ACTIVE",
      insuredPerson: {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
      },
      policyNumber: "",
      insuranceCardNumber: "",
      additionalInfo: {
        notes: "",
        specialConditions: "",
        medicalHistory: "",
      },
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl dark:bg-boxdark">
        <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {mode === "create" ? "Nouveau Dépendant" : "Modifier le Dépendant"}
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
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
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
                  placeholder="Prénom du dépendant"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
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
                  placeholder="Nom du dépendant"
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
                  Relation *
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
            </div>
          </div>

          {/* Personne assurée */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Personne Assurée
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
                  <option value="">Sélectionner une personne assurée</option>
                  {mockInsuredPersons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName} ({person.email})
                    </option>
                  ))}
                </select>
                {errors.insuredPerson?.id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.insuredPerson.id}
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
                  Numéro de carte d'assurance
                </label>
                <input
                  type="text"
                  name="insuranceCardNumber"
                  value={formData.insuranceCardNumber || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: CARD-2024-001-01"
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Antécédents médicaux
                </label>
                <textarea
                  name="additionalInfo.medicalHistory"
                  value={formData.additionalInfo?.medicalHistory || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Antécédents médicaux importants..."
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
                Dépendant actif
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
