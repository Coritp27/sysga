"use client";

import { useState } from "react";
import { SearchIcon } from "../assets/icons";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const periodOptions = [
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "quarter", label: "Ce trimestre" },
    { value: "year", label: "Cette année" },
  ];

  const reportOptions = [
    { value: "overview", label: "Vue d'ensemble" },
    { value: "policies", label: "Rapport des polices" },
    { value: "claims", label: "Rapport des réclamations" },
    { value: "financial", label: "Rapport financier" },
    { value: "blockchain", label: "Rapport blockchain" },
  ];

  const mockStats = {
    totalPolicies: 1247,
    activePolicies: 1189,
    totalClaims: 89,
    pendingClaims: 23,
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
    blockchainTransactions: 3456,
    confirmedTransactions: 3421,
  };

  const mockChartData = {
    policiesByMonth: [
      { month: "Jan", count: 120 },
      { month: "Fév", count: 135 },
      { month: "Mar", count: 142 },
      { month: "Avr", count: 158 },
      { month: "Mai", count: 167 },
      { month: "Juin", count: 189 },
    ],
    claimsByType: [
      { type: "Santé", count: 45, percentage: 50.6 },
      { type: "Auto", count: 23, percentage: 25.8 },
      { type: "Habitation", count: 12, percentage: 13.5 },
      { type: "Vie", count: 9, percentage: 10.1 },
    ],
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Rapports et Statistiques
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90">
            <SearchIcon className="mr-2 h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Filtres de rapport */}
      <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-black dark:text-white">
            Type de rapport:
          </label>
          <div className="flex flex-wrap gap-2">
            {reportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedReport(option.value)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  selectedReport === option.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-meta-4 dark:text-gray-300 dark:hover:bg-meta-3"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Polices
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {mockStats.totalPolicies.toLocaleString()}
              </p>
              <p className="text-xs text-success">
                +{mockStats.monthlyGrowth}% ce mois
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Polices Actives
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {mockStats.activePolicies.toLocaleString()}
              </p>
              <p className="text-xs text-success">
                {(
                  (mockStats.activePolicies / mockStats.totalPolicies) *
                  100
                ).toFixed(1)}
                % taux d'activation
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
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
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Réclamations
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {mockStats.totalClaims}
              </p>
              <p className="text-xs text-warning">
                {mockStats.pendingClaims} en attente
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-orange-600"
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
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenus Totaux
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {(mockStats.totalRevenue / 1000000).toFixed(1)}M €
              </p>
              <p className="text-xs text-success">
                +{mockStats.monthlyGrowth}% ce mois
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Graphique des polices par mois */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Évolution des Polices
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockChartData.policiesByMonth.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 bg-primary rounded-t"
                  style={{ height: `${(item.count / 200) * 200}px` }}
                ></div>
                <span className="text-xs text-muted-foreground mt-2">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition des réclamations */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Répartition des Réclamations
          </h3>
          <div className="space-y-3">
            {mockChartData.claimsByType.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-black dark:text-white">
                  {item.type}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-meta-4">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau des transactions blockchain */}
      <div className="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Activité Blockchain
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-meta-4">
            <p className="text-2xl font-bold text-black dark:text-white">
              {mockStats.blockchainTransactions.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Transactions Totales
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-meta-4">
            <p className="text-2xl font-bold text-green-600">
              {mockStats.confirmedTransactions.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Transactions Confirmées
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-meta-4">
            <p className="text-2xl font-bold text-blue-600">
              {(
                (mockStats.confirmedTransactions /
                  mockStats.blockchainTransactions) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-muted-foreground">
              Taux de Confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
