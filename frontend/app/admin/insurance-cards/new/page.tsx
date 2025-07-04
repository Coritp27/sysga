"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

interface InsuredPerson {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cin: string;
  nif: string;
  dateOfBirth: string;
  policyEffectiveDate: string;
  hasDependent: boolean;
  numberOfDependent: number;
}

interface InsuranceCardFormData {
  insuredPersonId: number | null;
  insuredPersonName: string;
  cardNumber: string;
  policyNumber: string;
  dateOfBirth: string;
  policyEffectiveDate: string;
  hadDependent: boolean;
  numberOfDependent: number;
  status: "ACTIVE" | "INACTIVE" | "REVOKED";
  validUntil: string;
}

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "REVOKED", label: "Révoquée" },
];

// Fonction pour réinitialiser le formulaire
const getInitialFormData = (): InsuranceCardFormData => ({
  insuredPersonId: null,
  insuredPersonName: "",
  cardNumber: "",
  policyNumber: "",
  dateOfBirth: "",
  policyEffectiveDate: "",
  hadDependent: false,
  numberOfDependent: 0,
  status: "ACTIVE",
  validUntil: "",
});

export default function NewInsuranceCardPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [formData, setFormData] =
    useState<InsuranceCardFormData>(getInitialFormData());
  const [insuredPersons, setInsuredPersons] = useState<InsuredPerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<InsuredPerson | null>(
    null
  );
  const [isLoadingPersons, setIsLoadingPersons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    insuredPersonId?: string;
    insuredPersonName?: string;
    cardNumber?: string;
    policyNumber?: string;
    dateOfBirth?: string;
    policyEffectiveDate?: string;
    validUntil?: string;
    numberOfDependent?: string;
  }>({});

  // Hook pour écrire sur la blockchain
  const { data: hash, isPending, writeContract } = useWriteContract();

  // Hook pour attendre la confirmation de la transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Charger les personnes assurées
  useEffect(() => {
    const loadInsuredPersons = async () => {
      setIsLoadingPersons(true);
      try {
        const response = await fetch("/api/insured-persons");
        if (response.ok) {
          const data = await response.json();
          setInsuredPersons(data);
        } else {
          console.error("Erreur lors du chargement des personnes assurées");
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des personnes assurées:",
          error
        );
      } finally {
        setIsLoadingPersons(false);
      }
    };

    loadInsuredPersons();
  }, []);

  // Mettre à jour les données du formulaire quand une personne est sélectionnée
  useEffect(() => {
    if (selectedPerson) {
      setFormData((prev) => ({
        ...prev,
        insuredPersonId: selectedPerson.id,
        insuredPersonName: `${selectedPerson.firstName} ${selectedPerson.lastName}`,
        dateOfBirth: selectedPerson.dateOfBirth.split("T")[0],
        policyEffectiveDate: selectedPerson.policyEffectiveDate.split("T")[0],
        hadDependent: selectedPerson.hasDependent,
        numberOfDependent: selectedPerson.numberOfDependent,
      }));
    }
  }, [selectedPerson]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Effacer l'erreur du champ modifié
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handlePersonSelect = (personId: number) => {
    const person = insuredPersons.find((p) => p.id === personId);
    setSelectedPerson(person || null);

    if (errors.insuredPersonId) {
      setErrors((prev) => ({
        ...prev,
        insuredPersonId: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.insuredPersonId) {
      newErrors.insuredPersonId = "Veuillez sélectionner une personne assurée";
    }

    if (!formData.insuredPersonName.trim()) {
      newErrors.insuredPersonName = "Le nom de la personne assurée est requis";
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    }

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "Le numéro de police est requis";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    }

    if (!formData.policyEffectiveDate) {
      newErrors.policyEffectiveDate =
        "La date d'effet de la police est requise";
    }

    if (!formData.validUntil) {
      newErrors.validUntil = "La date de validité est requise";
    }

    if (formData.hadDependent && formData.numberOfDependent <= 0) {
      newErrors.numberOfDependent =
        "Le nombre de dépendants doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert(
        "Veuillez vous connecter à votre wallet pour créer une carte d'assurance"
      );
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Convertir la date d'émission en timestamp Unix pour la blockchain
      const issuedOnTimestamp = Math.floor(
        new Date(formData.policyEffectiveDate).getTime() / 1000
      );

      // Appel au smart contract
      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "addInsuranceCard",
        args: [
          formData.cardNumber,
          issuedOnTimestamp,
          formData.status.toLowerCase(),
          address, // Adresse de la compagnie d'assurance (wallet connecté)
        ],
        account: address,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la carte:", error);
      alert("Erreur lors de la création de la carte d'assurance");
      setIsSubmitting(false);
    }
  };

  // Sauvegarder en base de données après confirmation blockchain
  useEffect(() => {
    if (isConfirmed && hash) {
      const saveToDatabase = async () => {
        try {
          // Récupérer les données de la transaction blockchain
          const response = await fetch("/api/insurance-cards", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              insuredPersonId: formData.insuredPersonId,
              cardNumber: formData.cardNumber,
              policyNumber: formData.policyNumber,
              dateOfBirth: formData.dateOfBirth,
              policyEffectiveDate: formData.policyEffectiveDate,
              hadDependent: formData.hadDependent,
              numberOfDependent: formData.numberOfDependent,
              status: formData.status,
              validUntil: formData.validUntil,
              blockchainReference: Date.now(), // Référence unique
              blockchainTxHash: hash,
            }),
          });

          if (response.ok) {
            alert("Carte d'assurance créée avec succès !");
            // Réinitialiser le formulaire
            setFormData(getInitialFormData());
            setSelectedPerson(null);
            setErrors({});
            // Redirection vers la liste
            setTimeout(() => {
              router.push("/admin/insurance-cards");
            }, 1000);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur lors de la sauvegarde");
          }
        } catch (error) {
          console.error("Erreur lors de la sauvegarde en base:", error);
          alert(
            `Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : "Erreur inconnue"}`
          );
        } finally {
          setIsSubmitting(false);
        }
      };

      saveToDatabase();
    }
  }, [isConfirmed, hash, formData, router]);

  const handleCancel = () => {
    router.push("/admin/insurance-cards");
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Nouvelle Carte d'Assurance" />

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
            Nouvelle Carte d'Assurance
          </h2>
        </div>
      </div>

      {/* Statut de la transaction */}
      {hash && (
        <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Transaction en cours...
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Hash: {hash.substring(0, 10)}...
                {hash.substring(hash.length - 10)}
              </p>
            </div>
          </div>
        </div>
      )}

      {isConfirming && (
        <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-yellow-600 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Confirmation de la transaction...
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300">
                Veuillez patienter pendant que la transaction est confirmée sur
                la blockchain
              </p>
            </div>
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Transaction confirmée !
              </p>
              <p className="text-xs text-green-600 dark:text-green-300">
                Sauvegarde en base de données en cours...
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sélection de la personne assurée */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Sélection de la Personne Assurée
          </h3>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Personne assurée *
            </label>
            {isLoadingPersons ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-gray-500">
                  Chargement...
                </span>
              </div>
            ) : (
              <select
                value={formData.insuredPersonId || ""}
                onChange={(e) => handlePersonSelect(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.insuredPersonId
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              >
                <option value="">Sélectionner une personne assurée</option>
                {insuredPersons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName} - {person.email} (CIN:{" "}
                    {person.cin})
                  </option>
                ))}
              </select>
            )}
            {errors.insuredPersonId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.insuredPersonId}
              </p>
            )}
          </div>

          {/* Informations de la personne sélectionnée */}
          {selectedPerson && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Informations de la personne sélectionnée :
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Nom complet :</span>{" "}
                  {selectedPerson.firstName} {selectedPerson.lastName}
                </div>
                <div>
                  <span className="font-medium">Email :</span>{" "}
                  {selectedPerson.email}
                </div>
                <div>
                  <span className="font-medium">CIN :</span>{" "}
                  {selectedPerson.cin}
                </div>
                <div>
                  <span className="font-medium">NIF :</span>{" "}
                  {selectedPerson.nif}
                </div>
                <div>
                  <span className="font-medium">Dépendants :</span>{" "}
                  {selectedPerson.hasDependent
                    ? `Oui (${selectedPerson.numberOfDependent})`
                    : "Non"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informations de la carte */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations de la Carte d'Assurance
          </h3>

          {/* Informations de base */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              Informations de base
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nom de la personne assurée *
                </label>
                <input
                  type="text"
                  name="insuredPersonName"
                  value={formData.insuredPersonName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.insuredPersonName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.insuredPersonName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.insuredPersonName}
                  </p>
                )}
              </div>

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
                  placeholder="ex: CARD-2024-001"
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.cardNumber}
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
                  placeholder="ex: 123456789"
                />
                {errors.policyNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.policyNumber}
                  </p>
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
                  Date d'effet de la police *
                </label>
                <input
                  type="date"
                  name="policyEffectiveDate"
                  value={formData.policyEffectiveDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.policyEffectiveDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.policyEffectiveDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.policyEffectiveDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Date de validité *
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.validUntil
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                />
                {errors.validUntil && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.validUntil}
                  </p>
                )}
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hadDependent"
                  checked={formData.hadDependent}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="text-sm font-medium text-black dark:text-white">
                  A des dépendants
                </label>
              </div>

              {formData.hadDependent && (
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Nombre de dépendants *
                  </label>
                  <input
                    type="number"
                    name="numberOfDependent"
                    value={formData.numberOfDependent}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.numberOfDependent
                        ? "border-red-500"
                        : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                    }`}
                  />
                  {errors.numberOfDependent && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.numberOfDependent}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-6 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
            disabled={isSubmitting || isPending || isConfirming}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isConnected || isSubmitting || isPending || isConfirming}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isPending || isConfirming
              ? "Création..."
              : "Créer la Carte"}
          </button>
        </div>
      </form>
    </div>
  );
}
