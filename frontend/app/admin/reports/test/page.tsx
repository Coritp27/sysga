"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CreditCard,
  Shield,
  TrendingUp,
  Download,
  AlertCircle,
} from "lucide-react";

interface ReportsData {
  stats: {
    totalCards: number;
    activeCards: number;
    inactiveCards: number;
    revokedCards: number;
    cardsWithBlockchain: number;
    newCardsThisMonth: number;
    expiredCards: number;
    blockchainTransactions: number;
    confirmedTransactions: number;
    activationRate: string;
    confirmationRate: string;
  };
  period: {
    currentMonth: number;
    currentYear: number;
    monthName: string;
  };
}

export default function ReportsTestPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Test - Appel de l'API reports...");
        const response = await fetch("/api/reports");
        console.log(
          "Test - Réponse reçue:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Test - Erreur HTTP:", response.status, errorText);
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const reportsData = await response.json();
        console.log("Test - Données reçues:", reportsData);
        setData(reportsData);
      } catch (err) {
        console.error("Test - Erreur complète:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <h1 className="text-2xl font-bold mb-4">Test des Rapports</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des rapports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <h1 className="text-2xl font-bold mb-4">Test des Rapports</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Erreur lors du chargement</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <h1 className="text-2xl font-bold mb-4">Test des Rapports</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Aucune donnée disponible</p>
          </div>
        </div>
      </div>
    );
  }

  const cardStats = [
    {
      title: "Cartes d'Assurance",
      value: data.stats.totalCards.toLocaleString(),
      description: "Total des cartes créées",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Cartes Actives",
      value: data.stats.activeCards.toLocaleString(),
      description: "Cartes en statut actif",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Transactions Blockchain",
      value: data.stats.blockchainTransactions.toLocaleString(),
      description: "Transactions confirmées",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Nouvelles ce Mois",
      value: data.stats.newCardsThisMonth.toString(),
      description: `Cartes créées en ${data.period.monthName}`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <h1 className="text-2xl font-bold mb-4">Test des Rapports VeriCarte</h1>
      <p className="text-gray-600 mb-6">
        Statistiques et analyses du système d'assurance -{" "}
        {data.period.monthName} {data.period.currentYear}
      </p>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {cardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Détails */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Détails des Statistiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.stats.totalCards}
            </p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {data.stats.activeCards}
            </p>
            <p className="text-sm text-gray-600">Actives</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {data.stats.expiredCards}
            </p>
            <p className="text-sm text-gray-600">Expirées</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {data.stats.blockchainTransactions}
            </p>
            <p className="text-sm text-gray-600">Blockchain</p>
          </div>
        </div>
      </div>

      {/* Informations de debug */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">
          Informations de Debug
        </h3>
        <pre className="text-sm text-gray-600 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
