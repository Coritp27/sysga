"use client";
import { useState } from "react";
import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import { Card, CardContent } from "../ui/card";

const ContractDiagnostic = () => {
  const { address, isConnected } = useAccount();
  const [diagnosticResults, setDiagnosticResults] = useState({});

  // Test de lecture du nextId pour vérifier que le contrat répond
  const {
    data: nextId,
    isLoading: nextIdLoading,
    error: nextIdError,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "nextId",
  });

  // Test de lecture des cartes pour l'adresse connectée
  const {
    data: userCards,
    isLoading: cardsLoading,
    error: cardsError,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getInsuranceCards",
    args: [address],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const runDiagnostic = () => {
    const results = {
      contractAddress,
      isConnected,
      userAddress: address,
      nextId: nextId?.toString(),
      nextIdError: nextIdError?.message,
      userCardsCount: Array.isArray(userCards) ? userCards.length : 0,
      userCardsData: userCards,
      cardsError: cardsError?.message,
      timestamp: new Date().toISOString(),
    };

    setDiagnosticResults(results);
    console.log("🔍 Diagnostic Results:", results);
  };

  return (
    <div className="add">
      <div className="add_inner">
        <h1 className="add_inner_title">
          <span className="add_inner_title_colored">
            Diagnostic du Contrat Blockchain
          </span>
        </h1>

        <Card>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Informations de Base
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Adresse du contrat:</strong> {contractAddress}
                  </p>
                  <p>
                    <strong>Connecté:</strong>{" "}
                    {isConnected ? "✅ Oui" : "❌ Non"}
                  </p>
                  <p>
                    <strong>Adresse utilisateur:</strong>{" "}
                    {address || "Non connecté"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Test de Connexion au Contrat
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>nextId:</strong>{" "}
                    {nextIdLoading
                      ? "Chargement..."
                      : nextIdError
                        ? `❌ Erreur: ${nextIdError.message}`
                        : `✅ ${nextId?.toString() || "0"}`}
                  </p>
                  <p>
                    <strong>Cartes utilisateur:</strong>{" "}
                    {cardsLoading
                      ? "Chargement..."
                      : cardsError
                        ? `❌ Erreur: ${cardsError.message}`
                        : `✅ ${Array.isArray(userCards) ? userCards.length : 0} cartes`}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Actions</h3>
                <button
                  onClick={runDiagnostic}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  🔍 Lancer le Diagnostic
                </button>
              </div>

              {Object.keys(diagnosticResults).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Résultats du Diagnostic
                  </h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(diagnosticResults, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Solutions Possibles
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    1. <strong>Vérifiez que le contrat est déployé</strong> sur
                    le bon réseau
                  </p>
                  <p>
                    2. <strong>Vérifiez l'adresse du contrat</strong> dans
                    constants/index.js
                  </p>
                  <p>
                    3. <strong>Créez une première carte</strong> pour tester
                    l'écriture
                  </p>
                  <p>
                    4. <strong>Vérifiez que vous êtes sur le bon réseau</strong>{" "}
                    (localhost:8545 pour Hardhat)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractDiagnostic;
