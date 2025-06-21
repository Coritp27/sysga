import React from "react";
import {
  Users,
  CreditCard,
  Building2,
  FileText,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
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
  trend,
}: StatCardProps) => (
  <div className="rounded-lg border bg-white p-6 shadow-sm">
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </div>
    <div className="p-6 pt-0">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
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
          <span className="text-muted-foreground ml-1">vs mois dernier</span>
        </div>
      )}
    </div>
  </div>
);

const DashboardStats = () => {
  // TODO: Récupérer les vraies données depuis la base de données
  const stats = [
    {
      title: "Personnes Assurées",
      value: "1,234",
      description: "Total des personnes actuellement assurées",
      icon: <Users className="h-4 w-4" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Cartes Actives",
      value: "1,156",
      description: "Cartes d'assurance en statut actif",
      icon: <CreditCard className="h-4 w-4" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Entreprises",
      value: "45",
      description: "Entreprises partenaires",
      icon: <Building2 className="h-4 w-4" />,
      trend: { value: 3, isPositive: true },
    },
    {
      title: "Polices Actives",
      value: "892",
      description: "Polices d'assurance en cours",
      icon: <FileText className="h-4 w-4" />,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Cartes Expirant",
      value: "23",
      description: "Cartes expirant dans les 30 jours",
      icon: <AlertTriangle className="h-4 w-4" />,
      trend: { value: 15, isPositive: false },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
