"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";

interface BlockchainCard {
  id: bigint;
  cardNumber: string;
  issuedOn: bigint;
  status: string;
  insuranceCompany: string;
}

export default function BlockchainExplorerPage() {
  const { address, isConnected } = useAccount();
  const [searchAddress, setSearchAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  // Lecture des cartes pour l'adresse recherchée
  const {
    data: userCards,
    isLoading,
    error,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getInsuranceCards",
    args: [currentAddress],
    query: {
      enabled: !!currentAddress,
    },
  });

  // Lecture du nextId pour vérifier l'état du contrat
  const { data: nextId } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "nextId",
  });

  const handleSearch = () => {
    if (searchAddress) {
      setCurrentAddress(searchAddress);
    }
  };

  const searchMyCards = () => {
    if (address) {
      setSearchAddress(address);
      setCurrentAddress(address);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          🔍 Explorateur Blockchain
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualisez les cartes d'assurance stockées sur la blockchain Ethereum
        </p>
      </div>

      {/* Informations du contrat */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Informations du Contrat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Adresse du Contrat
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {contractAddress}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total de Cartes Créées
            </label>
            <p className="text-2xl font-bold text-blue-600">
              {nextId ? Number(nextId) : "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Recherche d'adresse */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Rechercher des Cartes
        </h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Adresse Ethereum
            </label>
            <input
              id="address"
              type="text"
              placeholder="0x1234...abcd"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              disabled={!searchAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Rechercher
            </button>
            {isConnected && (
              <button
                onClick={searchMyCards}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Mes Cartes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Résultats */}
      {currentAddress && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Cartes d'Assurance pour {formatAddress(currentAddress)}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Chargement des cartes...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">
                ❌ Erreur lors de la lecture
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error.message}
              </p>
            </div>
          ) : Array.isArray(userCards) && userCards.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {userCards.length} carte(s) trouvée(s)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCards.map((card: BlockchainCard, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        Carte #{Number(card.id)}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}
                      >
                        {card.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Numéro de Carte
                        </label>
                        <p className="font-mono text-sm text-black dark:text-white">
                          {card.cardNumber}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Date d'Émission
                        </label>
                        <p className="text-sm text-black dark:text-white">
                          {formatDate(card.issuedOn)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Compagnie d'Assurance
                        </label>
                        <p className="font-mono text-sm text-black dark:text-white">
                          {formatAddress(card.insuranceCompany)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400 mb-2">
                📭 Aucune carte trouvée
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cette adresse n'a pas encore de cartes d'assurance sur la
                blockchain
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!currentAddress && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            💡 Comment utiliser l'explorateur
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>1.</strong> Entrez une adresse Ethereum dans le champ de
              recherche
            </p>
            <p>
              <strong>2.</strong> Cliquez sur "Rechercher" pour voir toutes les
              cartes d'assurance de cette adresse
            </p>
            <p>
              <strong>3.</strong> Si vous êtes connecté, vous pouvez cliquer sur
              "Mes Cartes" pour voir vos propres cartes
            </p>
            <p>
              <strong>4.</strong> Les cartes sont stockées de manière immuable
              sur la blockchain Ethereum
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
