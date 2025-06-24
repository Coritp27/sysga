"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

interface InsuranceCardFormData {
  cardNumber: string;
  issuedOn: string; // Date d'émission (sera convertie en timestamp)
  status: string;
  insuranceCompany: string; // Adresse de la compagnie d'assurance
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expirée" },
  { value: "suspended", label: "Suspendue" },
];

// Adresses mockées des compagnies d'assurance (en production, ceci viendrait de la DB)
const mockInsuranceCompanies = [
  {
    address: "0x1234567890123456789012345678901234567890",
    name: "AXA Assurance",
  },
  {
    address: "0x2345678901234567890123456789012345678901",
    name: "Allianz France",
  },
  { address: "0x3456789012345678901234567890123456789012", name: "Groupama" },
  { address: "0x4567890123456789012345678901234567890123", name: "MAIF" },
  { address: "0x5678901234567890123456789012345678901234", name: "MACIF" },
];

export default function NewInsuranceCardPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [formData, setFormData] = useState<InsuranceCardFormData>({
    cardNumber: "",
    issuedOn: "",
    status: "active",
    insuranceCompany: "",
  });

  const [errors, setErrors] = useState<{
    cardNumber?: string;
    issuedOn?: string;
    insuranceCompany?: string;
  }>({});

  // Hook pour écrire sur la blockchain
  const { data: hash, isPending, error, writeContract } = useWriteContract();

  // Hook pour attendre la confirmation de la transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      cardNumber?: string;
      issuedOn?: string;
      insuranceCompany?: string;
    } = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    }

    if (!formData.issuedOn) {
      newErrors.issuedOn = "La date d'émission est requise";
    }

    if (!formData.insuranceCompany) {
      newErrors.insuranceCompany = "La compagnie d'assurance est requise";
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

    try {
      // Convertir la date en timestamp Unix
      const issuedOnTimestamp = Math.floor(
        new Date(formData.issuedOn).getTime() / 1000
      );

      // Appel au smart contract
      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "addInsuranceCard",
        args: [
          formData.cardNumber,
          issuedOnTimestamp,
          formData.status,
          formData.insuranceCompany,
        ],
        account: address,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la carte:", error);
      alert("Erreur lors de la création de la carte d'assurance");
    }
  };

  const handleCancel = () => {
    router.push("/admin/insurance-cards");
  };

  // Redirection automatique après confirmation
  if (isConfirmed) {
    setTimeout(() => {
      router.push("/admin/insurance-cards");
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb avec ConnectButton */}
      <Breadcrumb pageName="Nouvelle Carte d'Assurance (Blockchain)" />

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
              <p className="text-sm font-medium text-black dark:text-white">
                Transaction en cours...
              </p>
              <p className="text-xs text-muted-foreground">
                Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
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
              <p className="text-sm font-medium text-black dark:text-white">
                Confirmation de la transaction...
              </p>
              <p className="text-xs text-muted-foreground">
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
              <p className="text-sm font-medium text-black dark:text-white">
                Carte d'assurance créée avec succès !
              </p>
              <p className="text-xs text-muted-foreground">
                Redirection automatique dans 2 secondes...
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-sm border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Erreur lors de la création
              </p>
              <p className="text-xs text-red-600 dark:text-red-300">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="mb-6 rounded-sm border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Wallet non connecté
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300">
                Veuillez connecter votre wallet pour créer une carte d'assurance
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations de Base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Numéro de carte *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                disabled={isPending || isConfirming}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cardNumber
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                } ${isPending || isConfirming ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="ex: CARD-2024-001"
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
                disabled={isPending || isConfirming}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.issuedOn
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                } ${isPending || isConfirming ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors.issuedOn && (
                <p className="mt-1 text-sm text-red-500">{errors.issuedOn}</p>
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
                disabled={isPending || isConfirming}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark ${
                  isPending || isConfirming
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
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
                Compagnie d'assurance (Adresse) *
              </label>
              <select
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleInputChange}
                disabled={isPending || isConfirming}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.insuranceCompany
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                } ${isPending || isConfirming ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="">Sélectionner une compagnie</option>
                {mockInsuranceCompanies.map((company) => (
                  <option key={company.address} value={company.address}>
                    {company.name} - {company.address.slice(0, 10)}...
                    {company.address.slice(-8)}
                  </option>
                ))}
              </select>
              {errors.insuranceCompany && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.insuranceCompany}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informations blockchain */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations Blockchain
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-blue-600"
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
                <p className="text-sm font-medium text-black dark:text-white">
                  Contrat Smart Contract
                </p>
                <p className="text-xs text-muted-foreground">
                  {contractAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Fonction
                </p>
                <p className="text-xs text-muted-foreground">
                  addInsuranceCard(cardNumber, issuedOn, status,
                  insuranceCompany)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Sécurité
                </p>
                <p className="text-xs text-muted-foreground">
                  Les données seront stockées de manière immuable sur la
                  blockchain
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending || isConfirming}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-6 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isConnected || isPending || isConfirming}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? "Création..."
              : isConfirming
                ? "Confirmation..."
                : "Créer sur Blockchain"}
          </button>
        </div>
      </form>
    </div>
  );
}
