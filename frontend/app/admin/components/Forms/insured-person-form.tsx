"use client";

import { useState, useEffect } from "react";

interface Dependent {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  relationship: string;
  nationalId: string;
  isActive: boolean;
}

interface InsuredPerson {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  city: string;
  postalCode: string;
  country: string;
  nationalId: string;
  passportNumber?: string;
  occupation: string;
  employer?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  isActive: boolean;
  dependents?: Dependent[];
}

interface InsuredPersonErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  nationalId?: string;
  passportNumber?: string;
  occupation?: string;
  employer?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  isActive?: string;
}

interface DependentErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  relationship?: string;
  nationalId?: string;
}

interface EnterpriseOption {
  id: number;
  name: string;
}

interface InsuredPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsuredPerson) => void;
  initialData?: InsuredPerson;
  mode: "create" | "edit";
  enterprises: EnterpriseOption[];
}

// Composant pour gérer un dépendant individuel
function DependentForm({
  dependent,
  onSave,
  onCancel,
  mode,
}: {
  dependent: Dependent;
  onSave: (dependent: Dependent) => void;
  onCancel: () => void;
  mode: "create" | "edit";
}) {
  const [formData, setFormData] = useState<Dependent>(dependent);
  const [errors, setErrors] = useState<DependentErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof DependentErrors]) {
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
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = "La relation est requise";
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = "Le numéro national est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl dark:bg-boxdark">
        <div className="flex items-center justify-between p-4 border-b border-stroke dark:border-strokedark">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            {mode === "create" ? "Nouveau Dépendant" : "Modifier le Dépendant"}
          </h3>
          <button
            onClick={onCancel}
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Prénom"
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
                placeholder="Nom"
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
                Genre *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="MALE">Homme</option>
                <option value="FEMALE">Femme</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Relation *
              </label>
              <input
                type="text"
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.relationship
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: Conjoint, Enfant, Parent"
              />
              {errors.relationship && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.relationship}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Numéro national *
              </label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.nationalId
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="Numéro national"
              />
              {errors.nationalId && (
                <p className="mt-1 text-sm text-red-500">{errors.nationalId}</p>
              )}
            </div>
          </div>

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

          <div className="flex justify-end space-x-3 pt-4 border-t border-stroke dark:border-strokedark">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-boxdark dark:text-gray-300 dark:border-strokedark dark:hover:bg-boxdark-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mode === "create" ? "Ajouter" : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InsuredPersonForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  enterprises,
}: InsuredPersonFormProps) {
  const [formData, setFormData] = useState<InsuredPerson>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    nationalId: "",
    passportNumber: "",
    occupation: "",
    employer: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    isActive: true,
    dependents: [],
  });

  const [errors, setErrors] = useState<InsuredPersonErrors>({});
  const [showDependentForm, setShowDependentForm] = useState(false);
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(
    null
  );
  const [dependentMode, setDependentMode] = useState<"create" | "edit">(
    "create"
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        emergencyContact: initialData.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
        },
        dependents: initialData.dependents || [],
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

    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      if (
        errors.emergencyContact?.[field as keyof typeof errors.emergencyContact]
      ) {
        setErrors((prev) => ({
          ...prev,
          emergencyContact: { ...prev.emergencyContact, [field]: undefined },
        }));
      }
    } else if (errors[name as keyof InsuredPersonErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: InsuredPersonErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
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

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = "Le numéro national est requis";
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = "La profession est requise";
    }

    // Validation contact d'urgence
    const emergencyErrors: any = {};
    if (!formData.emergencyContact?.name?.trim()) {
      emergencyErrors.name = "Le nom du contact d'urgence est requis";
    }
    if (!formData.emergencyContact?.phone?.trim()) {
      emergencyErrors.phone = "Le téléphone du contact d'urgence est requis";
    }

    if (Object.keys(emergencyErrors).length > 0) {
      newErrors.emergencyContact = emergencyErrors;
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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "MALE",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      nationalId: "",
      passportNumber: "",
      occupation: "",
      employer: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      isActive: true,
      dependents: [],
    });
    setErrors({});
    onClose();
  };

  // Gestion des dépendants
  const handleAddDependent = () => {
    setEditingDependent({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "MALE",
      relationship: "",
      nationalId: "",
      isActive: true,
    });
    setDependentMode("create");
    setShowDependentForm(true);
  };

  const handleEditDependent = (dependent: Dependent) => {
    setEditingDependent(dependent);
    setDependentMode("edit");
    setShowDependentForm(true);
  };

  const handleDeleteDependent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSaveDependent = (dependent: Dependent) => {
    if (dependentMode === "create") {
      setFormData((prev) => ({
        ...prev,
        dependents: [...(prev.dependents || []), dependent],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dependents:
          prev.dependents?.map((dep, index) =>
            dep === editingDependent ? dependent : dep
          ) || [],
      }));
    }
    setShowDependentForm(false);
    setEditingDependent(null);
  };

  const handleCancelDependent = () => {
    setShowDependentForm(false);
    setEditingDependent(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl dark:bg-boxdark">
          <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              {mode === "create"
                ? "Nouvelle Personne Assurée"
                : "Modifier la Personne Assurée"}
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

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                    placeholder="Prénom"
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
                    placeholder="Nom"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
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
                    placeholder="email@exemple.com"
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
                    Genre *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  >
                    <option value="MALE">Homme</option>
                    <option value="FEMALE">Femme</option>
                    <option value="OTHER">Autre</option>
                  </select>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
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
                    Numéro national *
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.nationalId
                        ? "border-red-500"
                        : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                    }`}
                    placeholder="Numéro national"
                  />
                  {errors.nationalId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.nationalId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Numéro de passeport
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                    placeholder="Numéro de passeport"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Profession *
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.occupation
                        ? "border-red-500"
                        : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                    }`}
                    placeholder="Profession"
                  />
                  {errors.occupation && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.occupation}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Entreprise affiliée
                  </label>
                  <select
                    name="employer"
                    value={formData.employer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionner une entreprise</option>
                    {enterprises.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact?.name || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.emergencyContact?.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                    }`}
                    placeholder="Nom du contact"
                  />
                  {errors.emergencyContact?.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.emergencyContact.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact?.phone || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.emergencyContact?.phone
                        ? "border-red-500"
                        : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                    }`}
                    placeholder="Téléphone"
                  />
                  {errors.emergencyContact?.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.emergencyContact.phone}
                    </p>
                  )}
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
                    placeholder="Relation (ex: Conjoint, Parent)"
                  />
                </div>
              </div>
            </div>

            {/* Gestion des dépendants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-black dark:text-white">
                  Dépendants
                </h3>
                <button
                  type="button"
                  onClick={handleAddDependent}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  + Ajouter un dépendant
                </button>
              </div>

              {formData.dependents && formData.dependents.length > 0 ? (
                <div className="space-y-3">
                  {formData.dependents.map((dependent, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-strokedark"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {dependent.firstName} {dependent.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {dependent.relationship} • {dependent.dateOfBirth}{" "}
                              •{" "}
                              {dependent.gender === "MALE"
                                ? "Homme"
                                : dependent.gender === "FEMALE"
                                  ? "Femme"
                                  : "Autre"}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${
                              dependent.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {dependent.isActive ? "Actif" : "Inactif"}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditDependent(dependent)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDependent(index)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Aucun dépendant ajouté</p>
                  <p className="text-sm">
                    Cliquez sur "Ajouter un dépendant" pour commencer
                  </p>
                </div>
              )}
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
                  Personne assurée active
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

      {/* Modal pour les dépendants */}
      {showDependentForm && editingDependent && (
        <DependentForm
          dependent={editingDependent}
          onSave={handleSaveDependent}
          onCancel={handleCancelDependent}
          mode={dependentMode}
        />
      )}
    </>
  );
}
