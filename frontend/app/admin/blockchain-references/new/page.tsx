"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BlockchainReferenceFormData {
  referenceId: string;
  type:
    | "TRANSACTION"
    | "CONTRACT"
    | "BLOCK"
    | "WALLET"
    | "TOKEN"
    | "NFT"
    | "OTHER";
  status: "PENDING" | "CONFIRMED" | "FAILED" | "EXPIRED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  blockchain: {
    name: string;
    network: string;
    version: string;
  };
  transactionInfo: {
    hash: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    currency: string;
    gasPrice: string;
    gasUsed: string;
    blockNumber: string;
    timestamp: string;
  };
  contractInfo: {
    address: string;
    name: string;
    type: string;
    abi: string;
    bytecode: string;
  };
  metadata: {
    description: string;
    tags: string[];
    category: string;
    source: string;
  };
  verification: {
    verified: boolean;
    verificationDate: string;
    verifiedBy: string;
    notes: string;
  };
  relatedEntities: {
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
    claim: {
      id: number;
      number: string;
      type: string;
    };
  };
  additionalInfo: string;
}

const typeOptions = [
  { value: "TRANSACTION", label: "Transaction" },
  { value: "CONTRACT", label: "Contrat intelligent" },
  { value: "BLOCK", label: "Bloc" },
  { value: "WALLET", label: "Portefeuille" },
  { value: "TOKEN", label: "Token" },
  { value: "NFT", label: "NFT" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmé" },
  { value: "FAILED", label: "Échoué" },
  { value: "EXPIRED", label: "Expiré" },
  { value: "CANCELLED", label: "Annulé" },
];

const priorityOptions = [
  { value: "LOW", label: "Faible" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Élevée" },
  { value: "URGENT", label: "Urgente" },
];

const blockchainOptions = [
  "Ethereum",
  "Bitcoin",
  "Polygon",
  "Binance Smart Chain",
  "Solana",
  "Cardano",
  "Polkadot",
  "Avalanche",
  "Arbitrum",
  "Optimism",
  "Base",
  "Polygon zkEVM",
  "Autre",
];

const networkOptions = [
  "Mainnet",
  "Testnet",
  "Goerli",
  "Sepolia",
  "Mumbai",
  "BSC Testnet",
  "Devnet",
  "Local",
];

const currencyOptions = [
  "ETH",
  "BTC",
  "MATIC",
  "BNB",
  "SOL",
  "ADA",
  "DOT",
  "AVAX",
  "USDT",
  "USDC",
  "DAI",
  "Autre",
];

const categoryOptions = [
  "Assurance",
  "Finance",
  "Santé",
  "Immobilier",
  "Transport",
  "Éducation",
  "Gouvernement",
  "Commerce",
  "Gaming",
  "Art",
  "Autre",
];

const tagOptions = [
  "DeFi",
  "NFT",
  "DAO",
  "Layer 2",
  "Cross-chain",
  "Privacy",
  "Scalability",
  "Security",
  "Compliance",
  "Insurance",
  "Claims",
  "Policies",
  "Smart Contract",
  "Oracle",
  "Bridge",
  "Staking",
  "Yield Farming",
  "Liquidity",
  "Governance",
  "Voting",
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

const mockClaims = [
  { id: 1, number: "CLM-2024-001", type: "Automobile" },
  { id: 2, number: "CLM-2024-002", type: "Santé" },
  { id: 3, number: "CLM-2024-003", type: "Habitation" },
  { id: 4, number: "CLM-2024-004", type: "Vie" },
  { id: 5, number: "CLM-2024-005", type: "Voyage" },
];

export default function NewBlockchainReferencePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BlockchainReferenceFormData>({
    referenceId: "",
    type: "TRANSACTION",
    status: "PENDING",
    priority: "MEDIUM",
    blockchain: {
      name: "",
      network: "",
      version: "",
    },
    transactionInfo: {
      hash: "",
      fromAddress: "",
      toAddress: "",
      amount: "",
      currency: "ETH",
      gasPrice: "",
      gasUsed: "",
      blockNumber: "",
      timestamp: "",
    },
    contractInfo: {
      address: "",
      name: "",
      type: "",
      abi: "",
      bytecode: "",
    },
    metadata: {
      description: "",
      tags: [],
      category: "",
      source: "",
    },
    verification: {
      verified: false,
      verificationDate: "",
      verifiedBy: "",
      notes: "",
    },
    relatedEntities: {
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
      claim: {
        id: 0,
        number: "",
        type: "",
      },
    },
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<{
    referenceId?: string;
    blockchain?: {
      name?: string;
    };
    transactionInfo?: {
      hash?: string;
      fromAddress?: string;
      toAddress?: string;
    };
    contractInfo?: {
      address?: string;
    };
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("blockchain.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        blockchain: { ...prev.blockchain, [field]: value },
      }));
      if (errors.blockchain?.[field as keyof typeof errors.blockchain]) {
        setErrors((prev) => ({
          ...prev,
          blockchain: { ...prev.blockchain, [field]: undefined },
        }));
      }
    } else if (name.startsWith("transactionInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        transactionInfo: { ...prev.transactionInfo, [field]: value },
      }));
      if (
        errors.transactionInfo?.[field as keyof typeof errors.transactionInfo]
      ) {
        setErrors((prev) => ({
          ...prev,
          transactionInfo: { ...prev.transactionInfo, [field]: undefined },
        }));
      }
    } else if (name.startsWith("contractInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contractInfo: { ...prev.contractInfo, [field]: value },
      }));
      if (errors.contractInfo?.[field as keyof typeof errors.contractInfo]) {
        setErrors((prev) => ({
          ...prev,
          contractInfo: { ...prev.contractInfo, [field]: undefined },
        }));
      }
    } else if (name.startsWith("metadata.")) {
      const field = name.split(".")[1];
      if (field === "tags") {
        setFormData((prev) => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            tags: checked
              ? [...prev.metadata.tags, value]
              : prev.metadata.tags.filter((tag) => tag !== value),
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          metadata: { ...prev.metadata, [field]: value },
        }));
      }
    } else if (name.startsWith("verification.")) {
      const field = name.split(".")[1];
      if (field === "verified") {
        setFormData((prev) => ({
          ...prev,
          verification: { ...prev.verification, verified: checked },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          verification: { ...prev.verification, [field]: value },
        }));
      }
    } else if (name.startsWith("relatedEntities.")) {
      const entity = name.split(".")[1];
      const field = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        relatedEntities: {
          ...prev.relatedEntities,
          [entity]: {
            ...prev.relatedEntities[
              entity as keyof typeof prev.relatedEntities
            ],
            [field]: field === "id" ? Number(value) : value,
          },
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

  const validateForm = (): boolean => {
    const newErrors: {
      referenceId?: string;
      blockchain?: {
        name?: string;
      };
      transactionInfo?: {
        hash?: string;
        fromAddress?: string;
        toAddress?: string;
      };
      contractInfo?: {
        address?: string;
      };
    } = {};

    if (!formData.referenceId.trim()) {
      newErrors.referenceId = "L'ID de référence est requis";
    }

    if (!formData.blockchain.name.trim()) {
      newErrors.blockchain = {
        ...newErrors.blockchain,
        name: "La blockchain est requise",
      };
    }

    if (formData.type === "TRANSACTION") {
      if (!formData.transactionInfo.hash.trim()) {
        newErrors.transactionInfo = {
          ...newErrors.transactionInfo,
          hash: "Le hash de transaction est requis",
        };
      }
      if (!formData.transactionInfo.fromAddress.trim()) {
        newErrors.transactionInfo = {
          ...newErrors.transactionInfo,
          fromAddress: "L'adresse d'origine est requise",
        };
      }
      if (!formData.transactionInfo.toAddress.trim()) {
        newErrors.transactionInfo = {
          ...newErrors.transactionInfo,
          toAddress: "L'adresse de destination est requise",
        };
      }
    }

    if (formData.type === "CONTRACT") {
      if (!formData.contractInfo.address.trim()) {
        newErrors.contractInfo = {
          ...newErrors.contractInfo,
          address: "L'adresse du contrat est requise",
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ici, vous pouvez ajouter la logique pour sauvegarder la référence blockchain
    console.log("Nouvelle référence blockchain:", formData);

    // Redirection vers la liste des références blockchain
    router.push("/admin/blockchain-references");
  };

  const handleCancel = () => {
    router.push("/admin/blockchain-references");
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
            Nouvelle Référence Blockchain
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
                ID de référence *
              </label>
              <input
                type="text"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.referenceId
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
                placeholder="ex: REF-2024-001"
              />
              {errors.referenceId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.referenceId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Type de référence
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

        {/* Informations blockchain */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Informations Blockchain
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Blockchain *
              </label>
              <select
                name="blockchain.name"
                value={formData.blockchain.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.blockchain?.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                }`}
              >
                <option value="">Sélectionner une blockchain</option>
                {blockchainOptions.map((blockchain) => (
                  <option key={blockchain} value={blockchain}>
                    {blockchain}
                  </option>
                ))}
              </select>
              {errors.blockchain?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.blockchain.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Réseau
              </label>
              <select
                name="blockchain.network"
                value={formData.blockchain.network}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner un réseau</option>
                {networkOptions.map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Version
              </label>
              <input
                type="text"
                name="blockchain.version"
                value={formData.blockchain.version}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: 1.0.0"
              />
            </div>
          </div>
        </div>

        {/* Informations de transaction */}
        {formData.type === "TRANSACTION" && (
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Informations de Transaction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Hash de transaction *
                </label>
                <input
                  type="text"
                  name="transactionInfo.hash"
                  value={formData.transactionInfo.hash}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.transactionInfo?.hash
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 0x1234567890abcdef..."
                />
                {errors.transactionInfo?.hash && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.transactionInfo.hash}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Adresse d'origine *
                </label>
                <input
                  type="text"
                  name="transactionInfo.fromAddress"
                  value={formData.transactionInfo.fromAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.transactionInfo?.fromAddress
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 0x1234567890abcdef..."
                />
                {errors.transactionInfo?.fromAddress && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.transactionInfo.fromAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Adresse de destination *
                </label>
                <input
                  type="text"
                  name="transactionInfo.toAddress"
                  value={formData.transactionInfo.toAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.transactionInfo?.toAddress
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 0x1234567890abcdef..."
                />
                {errors.transactionInfo?.toAddress && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.transactionInfo.toAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Montant
                </label>
                <input
                  type="text"
                  name="transactionInfo.amount"
                  value={formData.transactionInfo.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 1.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Devise
                </label>
                <select
                  name="transactionInfo.currency"
                  value={formData.transactionInfo.currency}
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

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Prix du gas
                </label>
                <input
                  type="text"
                  name="transactionInfo.gasPrice"
                  value={formData.transactionInfo.gasPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 20 Gwei"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Gas utilisé
                </label>
                <input
                  type="text"
                  name="transactionInfo.gasUsed"
                  value={formData.transactionInfo.gasUsed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 21000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Numéro de bloc
                </label>
                <input
                  type="text"
                  name="transactionInfo.blockNumber"
                  value={formData.transactionInfo.blockNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  name="transactionInfo.timestamp"
                  value={formData.transactionInfo.timestamp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                />
              </div>
            </div>
          </div>
        )}

        {/* Informations de contrat */}
        {formData.type === "CONTRACT" && (
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Informations de Contrat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Adresse du contrat *
                </label>
                <input
                  type="text"
                  name="contractInfo.address"
                  value={formData.contractInfo.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.contractInfo?.address
                      ? "border-red-500"
                      : "border-gray-300 dark:border-strokedark dark:bg-boxdark"
                  }`}
                  placeholder="ex: 0x1234567890abcdef..."
                />
                {errors.contractInfo?.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contractInfo.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nom du contrat
                </label>
                <input
                  type="text"
                  name="contractInfo.name"
                  value={formData.contractInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: InsuranceContract"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Type de contrat
                </label>
                <input
                  type="text"
                  name="contractInfo.type"
                  value={formData.contractInfo.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="ex: ERC20, ERC721, Custom"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  ABI (JSON)
                </label>
                <textarea
                  name="contractInfo.abi"
                  value={formData.contractInfo.abi}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Interface ABI du contrat..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Bytecode
                </label>
                <textarea
                  name="contractInfo.bytecode"
                  value={formData.contractInfo.bytecode}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  placeholder="Bytecode du contrat..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Métadonnées */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Métadonnées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description
              </label>
              <textarea
                name="metadata.description"
                value={formData.metadata.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Description de la référence blockchain..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Catégorie
              </label>
              <select
                name="metadata.category"
                value={formData.metadata.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner une catégorie</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Source
              </label>
              <input
                type="text"
                name="metadata.source"
                value={formData.metadata.source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: Etherscan, Blockchain Explorer"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              Tags
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tagOptions.map((tag) => (
                <label key={tag} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="metadata.tags"
                    value={tag}
                    checked={formData.metadata.tags.includes(tag)}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Vérification */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Vérification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="verification.verified"
                  checked={formData.verification.verified}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-black dark:text-white">
                  Vérifié
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Date de vérification
              </label>
              <input
                type="date"
                name="verification.verificationDate"
                value={formData.verification.verificationDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Vérifié par
              </label>
              <input
                type="text"
                name="verification.verifiedBy"
                value={formData.verification.verifiedBy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="ex: John Doe"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Notes de vérification
              </label>
              <textarea
                name="verification.notes"
                value={formData.verification.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="Notes sur la vérification..."
              />
            </div>
          </div>
        </div>

        {/* Entités liées */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Entités Liées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Personne assurée
              </label>
              <select
                name="relatedEntities.insuredPerson.id"
                value={formData.relatedEntities.insuredPerson.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner une personne</option>
                {mockInsuredPersons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName} - {person.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Police d'assurance
              </label>
              <select
                name="relatedEntities.policy.id"
                value={formData.relatedEntities.policy.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner une police</option>
                {mockPolicies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.number} - {policy.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Sinistre
              </label>
              <select
                name="relatedEntities.claim.id"
                value={formData.relatedEntities.claim.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
              >
                <option value="">Sélectionner un sinistre</option>
                {mockClaims.map((claim) => (
                  <option key={claim.id} value={claim.id}>
                    {claim.number} - {claim.type}
                  </option>
                ))}
              </select>
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
            Créer la Référence
          </button>
        </div>
      </form>
    </div>
  );
}
