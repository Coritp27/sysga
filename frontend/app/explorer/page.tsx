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

interface DatabaseCard {
  id: number;
  cardNumber: string;
  insuredPersonName: string;
  policyNumber: number;
  dateOfBirth: string;
  policyEffectiveDate: string;
  validUntil: string;
  status: string;
  hadDependent: boolean;
  numberOfDependent: number;
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    cin: string;
    nif: string;
  };
  insuranceCompany: {
    id: number;
    name: string;
  };
  blockchainReference: {
    id: number;
    reference: number;
    blockchainTxHash: string;
    createdAt: string;
  } | null;
}

interface SearchResult {
  blockchainCard?: BlockchainCard;
  databaseCard?: DatabaseCard;
}

export default function BlockchainExplorerPage() {
  const { address, isConnected } = useAccount();
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Lecture des cartes pour l'adresse connectée (blockchain)
  const {
    data: userCards,
    isLoading: isLoadingBlockchain,
    error: blockchainError,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getInsuranceCards",
    args: [address || ""],
    query: {
      enabled: !!address,
    },
  });

  // Lecture du nextId pour vérifier l'état du contrat
  const { data: nextId } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "nextId",
  });

  // Recherche universelle dans la base de données
  const searchInDatabase = async (searchTerm: string) => {
    try {
      const params = new URLSearchParams();
      params.append("search", searchTerm);
      params.append("all", "true"); // Toujours recherche globale

      const response = await fetch(`/api/insurance-cards?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const dbResults = await searchInDatabase(searchValue);
      const results: SearchResult[] = dbResults.map((dbCard: DatabaseCard) => ({
        databaseCard: dbCard,
      }));
      setSearchResults(results);
    } catch (error) {
      setSearchError("Erreur lors de la recherche");
      console.error("Erreur de recherche:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadAllCards = async () => {
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const dbResults = await searchInDatabase("");
      const results: SearchResult[] = dbResults.map((dbCard: DatabaseCard) => ({
        databaseCard: dbCard,
      }));
      setSearchResults(results);
    } catch (error) {
      setSearchError("Erreur lors de la récupération de toutes les cartes");
      console.error("Erreur:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (timestamp: bigint | string) => {
    const date =
      typeof timestamp === "bigint"
        ? new Date(Number(timestamp) * 1000)
        : new Date(timestamp);

    return date.toLocaleDateString("fr-FR", {
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
      case "revoked":
        return "bg-red-100 text-red-800";
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
          Trouvez rapidement une carte d'assurance
        </p>
      </div>

      {/* Informations du contrat */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Contrat Blockchain
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {contractAddress}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Cartes
            </label>
            <p className="text-2xl font-bold text-blue-600">
              {nextId ? Number(nextId) : "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Recherche ultra-simple */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
            🔍 Recherche Rapide
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Entrez un nom, CIN, NIF, numéro de carte ou numéro de police
          </p>
        </div>

        {/* Barre de recherche unique */}
        <div className="flex gap-4 max-w-2xl mx-auto">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Ex: John Wick, 123456789, 5258 97..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchValue.trim() || isSearching}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSearching ? "🔍" : "Rechercher"}
          </button>
        </div>

        {/* Bouton voir toutes les cartes */}
        <div className="text-center mt-6">
          <button
            onClick={loadAllCards}
            disabled={isSearching}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSearching ? "⏳" : "📋 Voir Toutes les Cartes"}
          </button>
        </div>

        {searchError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md max-w-2xl mx-auto">
            <p className="text-red-600 text-sm">{searchError}</p>
          </div>
        )}
      </div>

      {/* Mes cartes blockchain (si connecté) */}
      {isConnected && address && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            🏢 Mes Cartes Blockchain
          </h2>

          {isLoadingBlockchain ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Chargement...
              </span>
            </div>
          ) : blockchainError ? (
            <div className="text-center py-8 text-red-500">
              Erreur: {blockchainError.message}
            </div>
          ) : Array.isArray(userCards) && userCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCards.map((card: BlockchainCard, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-black dark:text-white">
                      Carte #{Number(card.id)}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}
                    >
                      {card.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Numéro:</span>{" "}
                      {card.cardNumber}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(card.issuedOn)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              Aucune carte blockchain trouvée
            </div>
          )}
        </div>
      )}

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            📋 Résultats ({searchResults.length} carte(s))
          </h2>

          <div className="space-y-4">
            {searchResults.map((result, index) => {
              const card = result.databaseCard;
              if (!card) return null;

              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      {card.insuredPerson.firstName}{" "}
                      {card.insuredPerson.lastName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(card.status)}`}
                    >
                      {card.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Informations principales */}
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Carte:</span>{" "}
                        {card.cardNumber}
                      </div>
                      <div>
                        <span className="font-medium">Police:</span>{" "}
                        {card.policyNumber}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {card.insuredPerson.email}
                      </div>
                      <div>
                        <span className="font-medium">CIN:</span>{" "}
                        {card.insuredPerson.cin}
                      </div>
                      <div>
                        <span className="font-medium">NIF:</span>{" "}
                        {card.insuredPerson.nif}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Naissance:</span>{" "}
                        {formatDate(card.dateOfBirth)}
                      </div>
                      <div>
                        <span className="font-medium">Effet:</span>{" "}
                        {formatDate(card.policyEffectiveDate)}
                      </div>
                      <div>
                        <span className="font-medium">Validité:</span>{" "}
                        {formatDate(card.validUntil)}
                      </div>
                      {card.hadDependent && (
                        <div>
                          <span className="font-medium">Dépendants:</span>{" "}
                          {card.numberOfDependent}
                        </div>
                      )}
                    </div>

                    {/* Compagnie et blockchain */}
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Compagnie:</span>{" "}
                        {card.insuranceCompany.name}
                      </div>
                      {card.blockchainReference && (
                        <>
                          <div>
                            <span className="font-medium">Référence:</span>{" "}
                            {card.blockchainReference.reference}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Hash:</span>{" "}
                            {card.blockchainReference.blockchainTxHash.slice(
                              0,
                              20
                            )}
                            ...
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions simples */}
      {searchResults.length === 0 && !isSearching && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            💡 Comment utiliser
          </h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>
              <strong>1.</strong> Entrez un nom, CIN, NIF ou numéro de carte
            </p>
            <p>
              <strong>2.</strong> Cliquez sur "Rechercher"
            </p>
            <p>
              <strong>3.</strong> Ou cliquez sur "Voir Toutes les Cartes"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
