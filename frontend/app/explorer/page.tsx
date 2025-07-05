"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  CreditCard,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useContractRead } from "wagmi";
import { contractAbi } from "../../constants";

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

interface BlockchainCard {
  id: number;
  cardNumber: string;
  issuedOn: number;
  status: string;
  insuranceCompany: string;
}

export default function BlockchainExplorerPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<DatabaseCard | null>(null);
  const [blockchainData, setBlockchainData] = useState<BlockchainCard | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "mismatch" | "not-found"
  >("pending");
  const [isClient, setIsClient] = useState(false);

  // Éviter l'hydratation avec des données qui changent
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lecture des données blockchain
  const { data: blockchainCards } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: contractAbi,
    functionName: "getInsuranceCards",
    args: [process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`],
  });

  // Recherche ultra-simple
  const searchCard = async () => {
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);
    setBlockchainData(null);
    setVerificationStatus("pending");

    try {
      const params = new URLSearchParams();
      params.append("search", searchValue);
      params.append("all", "true");

      const response = await fetch(`/api/insurance-cards?${params.toString()}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur HTTP:", response.status, errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const results = await response.json();

      if (results.length > 0) {
        const dbCard = results[0];
        setSearchResult(dbCard);

        // Vérifier les données blockchain
        if (dbCard.blockchainReference && blockchainCards) {
          const blockchainCard = (blockchainCards as any[]).find(
            (card: any) =>
              card.id.toString() ===
              dbCard.blockchainReference?.reference.toString()
          );

          if (blockchainCard) {
            setBlockchainData({
              id: Number(blockchainCard.id),
              cardNumber: blockchainCard.cardNumber,
              issuedOn: Number(blockchainCard.issuedOn),
              status: blockchainCard.status,
              insuranceCompany: blockchainCard.insuranceCompany,
            });

            // Vérifier la cohérence
            const isCardNumberMatch =
              blockchainCard.cardNumber === dbCard.cardNumber;
            const isStatusMatch =
              blockchainCard.status.toLowerCase() ===
              dbCard.status.toLowerCase();

            if (isCardNumberMatch && isStatusMatch) {
              setVerificationStatus("verified");
            } else {
              setVerificationStatus("mismatch");
            }
          } else {
            setVerificationStatus("not-found");
          }
        } else {
          setVerificationStatus("not-found");
        }
      } else {
        setSearchError("Aucune carte trouvée");
      }
    } catch (error) {
      setSearchError("Erreur lors de la recherche");
      console.error("Erreur de recherche:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "inactive":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "revoked":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Carte Valide";
      case "inactive":
        return "Carte Inactive";
      case "revoked":
        return "Carte Révoquée";
      default:
        return "Statut Inconnu";
    }
  };

  const getVerificationIcon = () => {
    switch (verificationStatus) {
      case "verified":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "mismatch":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "not-found":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getVerificationText = () => {
    switch (verificationStatus) {
      case "verified":
        return "✅ Vérification Blockchain Réussie";
      case "mismatch":
        return "⚠️ Données Incohérentes";
      case "not-found":
        return "❌ Non Trouvé sur Blockchain";
      default:
        return "⏳ Vérification en cours...";
    }
  };

  const formatDate = (dateString: string) => {
    // Éviter l'hydratation avec des dates qui changent
    if (!isClient) return "";

    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Forcer UTC pour la cohérence
    });
  };

  const formatBlockchainDate = (timestamp: number) => {
    // Utiliser UTC pour éviter les problèmes de fuseau horaire
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Forcer UTC pour la cohérence
    });
  };

  // Éviter l'hydratation complète si pas côté client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Vérification Carte d'Assurance
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Entrez le numéro de carte, CIN ou nom pour vérifier la validité
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Numéro de carte, CIN ou nom..."
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  disabled
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Vérifier
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comment vérifier une carte d'assurance ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <p className="text-gray-600">
                  Entrez le numéro de carte, CIN ou nom
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <p className="text-gray-600">Cliquez sur "Vérifier"</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <p className="text-gray-600">Consultez le résultat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* En-tête simple */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Vérification Carte d'Assurance
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Entrez le numéro de carte, CIN ou nom pour vérifier la validité
          </p>
        </div>

        {/* Recherche ultra-simple */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Numéro de carte, CIN ou nom..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchCard()}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={searchCard}
                disabled={!searchValue.trim() || isSearching}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Vérifier
                  </>
                )}
              </button>
            </div>
          </div>

          {searchError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-red-600 text-center">{searchError}</p>
            </div>
          )}
        </div>

        {/* Résultat avec vérification blockchain */}
        {searchResult && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
              {/* En-tête avec statut et vérification blockchain */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchResult.insuredPerson.firstName}{" "}
                    {searchResult.insuredPerson.lastName}
                  </h2>
                  <p className="text-gray-600">
                    Carte: {searchResult.cardNumber}
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    {getStatusIcon(searchResult.status)}
                    <p className="text-sm font-medium ml-2">
                      {getStatusText(searchResult.status)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    {getVerificationIcon()}
                    <p className="text-sm font-medium ml-2">
                      {getVerificationText()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations essentielles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Données de la base de données */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    📊 Données Base de Données
                  </h3>

                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Police #{searchResult.policyNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {searchResult.insuranceCompany.name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">Validité</p>
                    <p className="text-sm text-gray-600">
                      {isClient ? (
                        <>
                          Du {formatDate(searchResult.policyEffectiveDate)} au{" "}
                          {formatDate(searchResult.validUntil)}
                        </>
                      ) : (
                        <span className="text-gray-400">Chargement...</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">Identité</p>
                    <p className="text-sm text-gray-600">
                      CIN: {searchResult.insuredPerson.cin} | NIF:{" "}
                      {searchResult.insuredPerson.nif}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">Contact</p>
                    <p className="text-sm text-gray-600">
                      {searchResult.insuredPerson.email}
                    </p>
                  </div>

                  {searchResult.hadDependent && (
                    <div>
                      <p className="font-medium text-gray-900">Dépendants</p>
                      <p className="text-sm text-gray-600">
                        {searchResult.numberOfDependent} personne(s)
                      </p>
                    </div>
                  )}
                </div>

                {/* Données blockchain */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    ⛓️ Données Blockchain
                  </h3>

                  {blockchainData && isClient ? (
                    <>
                      <div>
                        <p className="font-medium text-gray-900">
                          Référence Blockchain
                        </p>
                        <p className="text-sm text-gray-600">
                          #{blockchainData.id}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          Numéro de Carte
                        </p>
                        <p className="text-sm text-gray-600">
                          {blockchainData.cardNumber}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          Date d'Émission
                        </p>
                        <p className="text-sm text-gray-600">
                          {isClient
                            ? formatBlockchainDate(blockchainData.issuedOn)
                            : "Chargement..."}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Statut</p>
                        <p className="text-sm text-gray-600">
                          {blockchainData.status}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Compagnie</p>
                        <p className="text-sm text-gray-600">
                          {blockchainData.insuranceCompany}
                        </p>
                      </div>

                      {searchResult.blockchainReference && (
                        <div>
                          <p className="font-medium text-gray-900">
                            Transaction Hash
                          </p>
                          <p className="text-sm text-gray-600 font-mono">
                            {searchResult.blockchainReference.blockchainTxHash}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        Aucune donnée blockchain trouvée
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton nouvelle recherche */}
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setSearchValue("");
                    setSearchResult(null);
                    setBlockchainData(null);
                    setSearchError("");
                    setVerificationStatus("pending");
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  Nouvelle Recherche
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions simples */}
        {!searchResult && !isSearching && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comment vérifier une carte d'assurance ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <p className="text-gray-600">
                  Entrez le numéro de carte, CIN ou nom
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <p className="text-gray-600">Cliquez sur "Vérifier"</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <p className="text-gray-600">Consultez le résultat</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
