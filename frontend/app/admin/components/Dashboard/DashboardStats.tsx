"use client";

import { useState, useEffect } from "react";
import { Users, CreditCard, Building2, TrendingUp, Shield } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  color,
  trend,
}: StatCardProps) => (
  <div className={`rounded-lg border bg-white p-6 shadow-sm ${color}`}>
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div className="h-4 w-4 text-gray-600">{icon}</div>
    </div>
    <div className="p-6 pt-0">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <p className="text-xs text-gray-600">{description}</p>
      {trend && (
        <div className="flex items-center text-xs mt-1">
          <TrendingUp
            className={`h-3 w-3 mr-1 ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          />
          <span
            className={trend.isPositive ? "text-green-500" : "text-red-500"}
          >
            {trend.isPositive ? "+" : "-"}
            {trend.value}%
          </span>
          <span className="text-gray-500 ml-1">vs mois dernier</span>
        </div>
      )}
    </div>
  </div>
);

interface DashboardStats {
  insuranceCards: {
    total: number;
    active: number;
    trend: number;
  };
  insuredPersons: {
    total: number;
    trend: number;
  };
  blockchainTransactions: {
    total: number;
    trend: number;
  };
  enterprises: {
    total: number;
    trend: number;
  };
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/stats");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des statistiques");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-lg border bg-white p-6 shadow-sm animate-pulse"
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </div>
            <div className="p-6 pt-0">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statsData = [
    {
      title: "Cartes d'Assurance",
      value: stats.insuranceCards.total.toLocaleString(),
      description: `${stats.insuranceCards.active} cartes actives`,
      icon: <CreditCard className="h-4 w-4" />,
      color: "border-blue-200 bg-blue-50",
      trend: {
        value: Math.abs(stats.insuranceCards.trend),
        isPositive: stats.insuranceCards.trend >= 0,
      },
    },
    {
      title: "Personnes Assurées",
      value: stats.insuredPersons.total.toLocaleString(),
      description: "Assurés principaux enregistrés",
      icon: <Users className="h-4 w-4" />,
      color: "border-green-200 bg-green-50",
      trend: {
        value: Math.abs(stats.insuredPersons.trend),
        isPositive: stats.insuredPersons.trend >= 0,
      },
    },
    {
      title: "Transactions Blockchain",
      value: stats.blockchainTransactions.total.toLocaleString(),
      description: "Transactions confirmées",
      icon: <Shield className="h-4 w-4" />,
      color: "border-purple-200 bg-purple-50",
      trend: {
        value: Math.abs(stats.blockchainTransactions.trend),
        isPositive: stats.blockchainTransactions.trend >= 0,
      },
    },
    {
      title: "Entreprises",
      value: stats.enterprises.total.toLocaleString(),
      description: "Entreprises clientes",
      icon: <Building2 className="h-4 w-4" />,
      color: "border-orange-200 bg-orange-50",
      trend: {
        value: Math.abs(stats.enterprises.trend),
        isPositive: stats.enterprises.trend >= 0,
      },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
