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

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [data, setData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const periodOptions = [
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "quarter", label: "Ce trimestre" },
    { value: "year", label: "Cette année" },
  ];

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🔍 Appel de l'API reports...");
        const response = await fetch("/api/reports");
        console.log("📡 Réponse reçue:", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Erreur HTTP:", response.status, errorText);
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const reportsData = await response.json();
        console.log("✅ Données reçues:", reportsData);
        setData(reportsData);
      } catch (err) {
        console.error("❌ Erreur complète:", err);
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

  const blockchainActivity = [
    {
      label: "Transactions Totales",
      value: data.stats.blockchainTransactions.toLocaleString(),
      color: "bg-gray-50",
    },
    {
      label: "Transactions Confirmées",
      value: data.stats.confirmedTransactions.toLocaleString(),
      color: "bg-green-50",
    },
    {
      label: "Taux de Confirmation",
      value: `${data.stats.confirmationRate}%`,
      color: "bg-blue-50",
    },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="space-y-6">
        {/* En-tête avec filtres */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rapports SYSGA</h2>
            <p className="text-gray-600">
              Statistiques et analyses du système d'assurance -{" "}
              {data.period.monthName} {data.period.currentYear}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
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

        {/* Activité Blockchain */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-gray-600" />
            Activité Blockchain
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blockchainActivity.map((item, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg ${item.color}`}
              >
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Informations sur les cartes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cartes expirées */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cartes Expirées
            </h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {data.stats.expiredCards}
              </p>
              <p className="text-sm text-gray-600">
                Cartes nécessitant un renouvellement
              </p>
            </div>
          </div>

          {/* Taux d'activation */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Taux d'Activation
            </h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {data.stats.activationRate}%
              </p>
              <p className="text-sm text-gray-600">
                Cartes actives sur le total
              </p>
            </div>
          </div>
        </div>

        {/* Détails supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium text-gray-900 mb-2">Cartes Inactives</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {data.stats.inactiveCards}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium text-gray-900 mb-2">Cartes Révoquées</h4>
            <p className="text-2xl font-bold text-red-600">
              {data.stats.revokedCards}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium text-gray-900 mb-2">Avec Blockchain</h4>
            <p className="text-2xl font-bold text-purple-600">
              {data.stats.cardsWithBlockchain}
            </p>
          </div>
        </div>

        {/* Note informative */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Rapports SYSGA</p>
              <p>
                Ces rapports reflètent l'activité de votre système d'assurance,
                incluant les cartes d'assurance et les transactions blockchain.
                Toutes les données sont synchronisées en temps réel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
