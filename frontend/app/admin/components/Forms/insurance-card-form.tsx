"use client";

import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import { useWorkspace } from "@/hooks/useWorkspace";

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

interface Policy {
  id: number;
  policyNumber: number;
  type: string;
  coverage: string;
  deductible: number;
  premiumAmount: number;
  description: string;
  validUntil: string;
  insuranceCompanyId: number;
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

interface InsuranceCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsuranceCardFormData) => void;
  initialData?: InsuranceCardFormData;
  mode: "create" | "edit";
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

export function InsuranceCardForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: InsuranceCardFormProps) {
  const { isLoading: userLoading } = useWorkspace();
  const { address } = useAccount();

  const [formData, setFormData] =
    useState<InsuranceCardFormData>(getInitialFormData());
  const [insuredPersons, setInsuredPersons] = useState<InsuredPerson[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<InsuredPerson | null>(
    null
  );
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isLoadingPersons, setIsLoadingPersons] = useState(false);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook pour écrire sur la blockchain (même approche que CreateCard)
  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Charger les personnes assurées et les polices
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        // Charger les personnes assurées
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

        // Charger les polices
        setIsLoadingPolicies(true);
        try {
          const policiesResponse = await fetch("/api/policies");
          if (policiesResponse.ok) {
            const policiesData = await policiesResponse.json();
            setPolicies(policiesData);
          } else {
            console.error("Erreur lors du chargement des polices");
          }
        } catch (error) {
          console.error("Erreur lors du chargement des polices:", error);
        } finally {
          setIsLoadingPolicies(false);
        }
      };

      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(getInitialFormData());
    }
  }, [initialData]);

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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePersonSelect = (personId: number) => {
    const person = insuredPersons.find((p) => p.id === personId);
    setSelectedPerson(person || null);

    // Update formData with the selected person ID
    setFormData((prev) => ({
      ...prev,
      insuredPersonId: personId,
      insuredPersonName: person ? `${person.firstName} ${person.lastName}` : "",
      dateOfBirth: person?.dateOfBirth || "",
      policyEffectiveDate: person?.policyEffectiveDate || "",
      hadDependent: person?.hasDependent || false,
      numberOfDependent: person?.numberOfDependent || 0,
    }));

    if (errors.insuredPersonId) {
      setErrors((prev) => ({
        ...prev,
        insuredPersonId: "",
      }));
    }
  };

  const handlePolicySelect = (policyId: number) => {
    const policy = policies.find((p) => p.id === policyId);
    setSelectedPolicy(policy || null);

    if (policy) {
      setFormData((prev) => ({
        ...prev,
        policyNumber: policy.policyNumber.toString(),
        validUntil: policy.validUntil.split("T")[0],
      }));
    }

    if (errors.policyNumber) {
      setErrors((prev) => ({
        ...prev,
        policyNumber: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    if (!validateForm() || isSubmitting) {
      return;
    }

    if (!address) {
      alert("Erreur: Veuillez connecter votre wallet.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Tentative de création de carte sur la blockchain:");
      console.log("- cardNumber:", formData.cardNumber);
      console.log("- policyNumber:", formData.policyNumber);
      console.log("- insuredPersonName:", formData.insuredPersonName);
      console.log("- status:", formData.status);
      console.log("- insuranceCompanyAddress:", address);

      // Convertir la date d'effet en timestamp

      // Utiliser la même approche que CreateCard
      console.log("🚀 Tentative de création de carte sur la blockchain:");
      console.log("- cardNumber:", formData.cardNumber);
      console.log("- policyNumber:", formData.policyNumber);
      console.log("- insuredPersonName:", formData.insuredPersonName);
      console.log("- status:", formData.status);
      console.log("- insuranceCompanyAddress:", address);

      // Convertir la date d'effet en timestamp
      const policyEffectiveTimestamp = Math.floor(
        new Date(formData.policyEffectiveDate).getTime() / 1000
      );

      try {
        writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "addInsuranceCard",
          args: [
            formData.cardNumber,
            policyEffectiveTimestamp,
            formData.status,
            address,
          ],
          account: address,
        });
      } catch (err) {
        console.error("❌ Erreur lors de l'appel writeContract:", err);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("❌ Erreur lors de l'appel writeContract:", err);
      setIsSubmitting(false);
    }
  };

  // Gérer les erreurs et la confirmation de transaction
  useEffect(() => {
    if (error) {
      console.error("❌ Erreur writeContract:", error);
      setIsSubmitting(false);
    }
  }, [error]);

  // Gérer la confirmation de transaction et sauvegarder en base
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log("✅ Transaction confirmée sur la blockchain:", hash);

      // Sauvegarder en base de données
      const saveToDatabase = async () => {
        try {
          console.log("💾 Sauvegarde en base de données...");

          // Log the data being sent for debugging
          const requestData = {
            insuredPersonId: formData.insuredPersonId,
            cardNumber: formData.cardNumber,
            policyNumber: formData.policyNumber,
            dateOfBirth: formData.dateOfBirth,
            policyEffectiveDate: formData.policyEffectiveDate,
            hadDependent: formData.hadDependent,
            status: formData.status,
            validUntil: formData.validUntil,
            blockchainReference: Date.now(),
            blockchainTxHash: hash,
          };

          console.log("📤 Données envoyées à l'API:", requestData);

          const response = await fetch("/api/insurance-cards", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("❌ Réponse d'erreur de l'API:", errorData);
            throw new Error(
              `Erreur HTTP: ${response.status} - ${errorData.error || "Erreur inconnue"}`
            );
          }

          const savedCard = await response.json();
          console.log("✅ Carte sauvegardée en base:", savedCard);

          setIsSubmitting(false);
          onSubmit(formData);
          onClose();
        } catch (error) {
          console.error("❌ Erreur lors de la sauvegarde:", error);
          setIsSubmitting(false);
          setErrors({
            submit: "Erreur lors de la sauvegarde en base de données",
          });
        }
      };

      saveToDatabase();
    }
  }, [isConfirmed, hash, formData, onSubmit, onClose]);

  const handleClose = () => {
    setFormData(getInitialFormData());
    setSelectedPerson(null);
    setSelectedPolicy(null);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  // Afficher un message si l'utilisateur n'a pas de compagnie d'assurance
  if (userLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 dark:bg-boxdark">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl dark:bg-boxdark">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélection de la personne assurée */}
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
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
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

          {/* Informations de la carte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Nom complet"
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
                placeholder="Ex: CARD-2024-001"
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Police d'assurance *
              </label>
              {isLoadingPolicies ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Chargement...
                  </span>
                </div>
              ) : (
                <select
                  value={selectedPolicy?.id || ""}
                  onChange={(e) => handlePolicySelect(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.policyNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                >
                  <option value="">Sélectionner une police d'assurance</option>
                  {policies.map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      Police #{policy.policyNumber} - {policy.type} (
                      {policy.coverage})
                    </option>
                  ))}
                </select>
              )}
              {errors.policyNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.policyNumber}
                </p>
              )}
            </div>

            {/* Informations de la police sélectionnée */}
            {selectedPolicy && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Informations de la police sélectionnée :
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Numéro :</span>{" "}
                    {selectedPolicy.policyNumber}
                  </div>
                  <div>
                    <span className="font-medium">Type :</span>{" "}
                    {selectedPolicy.type}
                  </div>
                  <div>
                    <span className="font-medium">Couverture :</span>{" "}
                    {selectedPolicy.coverage}
                  </div>
                  <div>
                    <span className="font-medium">Franchise :</span>{" "}
                    {selectedPolicy.deductible}€
                  </div>
                  <div>
                    <span className="font-medium">Prime :</span>{" "}
                    {selectedPolicy.premiumAmount}€
                  </div>
                  <div>
                    <span className="font-medium">Validité :</span>{" "}
                    {selectedPolicy.validUntil.split("T")[0]}
                  </div>
                </div>
              </div>
            )}

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
                <p className="mt-1 text-sm text-red-500">{errors.validUntil}</p>
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

          {/* Statut de la transaction */}
          {(isPending || isConfirming) && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {isPending
                      ? "Envoi de la transaction..."
                      : "Confirmation de la transaction..."}
                  </p>
                  {hash && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-300">
                      Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Erreur blockchain */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">
                Erreur blockchain: {error.toString()}
              </p>
            </div>
          )}

          {/* Erreur de sauvegarde */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">
                {errors.submit}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-strokedark dark:text-gray-300 dark:hover:bg-meta-4"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || isConfirming || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
              {isPending || isConfirming ? "En cours..." : "Créer la carte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
