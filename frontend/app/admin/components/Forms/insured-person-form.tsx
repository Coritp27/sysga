"use client";

import { useState, useEffect } from "react";

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
}

interface InsuredPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsuredPerson) => void;
  initialData?: InsuredPerson;
  mode: "create" | "edit";
}

export function InsuredPersonForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
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
  });

  const [errors, setErrors] = useState<Partial<InsuredPerson>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        emergencyContact: initialData.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
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

    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof InsuredPerson]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<InsuredPerson> = {};

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
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
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
                  Employeur
                </label>
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Employeur"
                />
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
  );
}
