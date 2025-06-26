"use client";

import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import { useWorkspace } from "@/hooks/useWorkspace";

interface BlockchainInsuranceCard {
  cardNumber: string;
  issuedOn: string; // Date d'émission
  status: string;
}

interface InsuranceCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BlockchainInsuranceCard) => void;
  initialData?: BlockchainInsuranceCard;
  mode: "create" | "edit";
}

export function InsuranceCardForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: InsuranceCardFormProps) {
  const { isLoading: userLoading } = useWorkspace();
  const { address } = useAccount();

  const [formData, setFormData] = useState<BlockchainInsuranceCard>({
    cardNumber: "",
    issuedOn: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook pour écrire sur la blockchain
  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "expired", label: "Expirée" },
    { value: "suspended", label: "Suspendue" },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    }

    if (!formData.issuedOn) {
      newErrors.issuedOn = "La date d'émission est requise";
    }

    if (!formData.status) {
      newErrors.status = "Le statut est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
      console.log("- issuedOn:", formData.issuedOn);
      console.log("- status:", formData.status);
      console.log("- insuranceCompanyAddress:", address);

      // Convertir la date en timestamp
      const issuedOnTimestamp = Math.floor(
        new Date(formData.issuedOn).getTime() / 1000
      );

      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "addInsuranceCard",
        args: [
          formData.cardNumber,
          issuedOnTimestamp,
          formData.status,
          address,
        ],
        account: address,
      });
    } catch (err) {
      console.error("❌ Erreur lors de l'appel writeContract:", err);
      setIsSubmitting(false);
    }
  };

  // Gérer le succès de la transaction
  useEffect(() => {
    if (isConfirmed) {
      console.log("✅ Transaction confirmée sur la blockchain");
      setIsSubmitting(false);
      onSubmit(formData);
      onClose();
    }
  }, [isConfirmed, formData, onSubmit, onClose]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      console.error("❌ Erreur writeContract:", error);
      setIsSubmitting(false);
    }
  }, [error]);

  const handleClose = () => {
    setFormData({
      cardNumber: "",
      issuedOn: "",
      status: "active",
    });
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
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl dark:bg-boxdark">
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
              Date d'émission *
            </label>
            <input
              type="date"
              name="issuedOn"
              value={formData.issuedOn}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.issuedOn
                  ? "border-red-500"
                  : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
              }`}
            />
            {errors.issuedOn && (
              <p className="mt-1 text-sm text-red-500">{errors.issuedOn}</p>
            )}
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
                Erreur: {error.toString()}
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
