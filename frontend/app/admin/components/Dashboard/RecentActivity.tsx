import React from "react";
import {
  Clock,
  User,
  CreditCard,
  Building2,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface ActivityItemProps {
  type: "card" | "person" | "company" | "policy";
  action: string;
  description: string;
  time: string;
  status: "success" | "warning" | "info";
}

const ActivityItem = ({
  type,
  action,
  description,
  time,
  status,
}: ActivityItemProps) => {
  const getIcon = () => {
    switch (type) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "person":
        return <User className="h-4 w-4" />;
      case "company":
        return <Building2 className="h-4 w-4" />;
      case "policy":
        return <FileText className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900">{action}</p>
          {getStatusIcon()}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex items-center mt-1">
          <Clock className="h-3 w-3 text-gray-400 mr-1" />
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  // TODO: Récupérer les vraies données depuis la base de données
  const activities = [
    {
      type: "card" as const,
      action: "Nouvelle carte créée",
      description: "Carte d'assurance #CARD123456 créée pour John Doe",
      time: "Il y a 2 minutes",
      status: "success" as const,
    },
    {
      type: "person" as const,
      action: "Personne assurée ajoutée",
      description: "Marie Dupont ajoutée au système avec CIN: CIN789012",
      time: "Il y a 15 minutes",
      status: "success" as const,
    },
    {
      type: "company" as const,
      action: "Entreprise mise à jour",
      description: "Informations de l'entreprise ABC Corp mises à jour",
      time: "Il y a 1 heure",
      status: "info" as const,
    },
    {
      type: "policy" as const,
      action: "Police renouvelée",
      description: "Police #POL1001 renouvelée pour 12 mois supplémentaires",
      time: "Il y a 2 heures",
      status: "success" as const,
    },
    {
      type: "card" as const,
      action: "Carte désactivée",
      description: "Carte #CARD654321 désactivée - expiration",
      time: "Il y a 3 heures",
      status: "warning" as const,
    },
    {
      type: "person" as const,
      action: "Dépendant ajouté",
      description: "Dépendant ajouté pour Jean Martin (relation: Enfant)",
      time: "Il y a 4 heures",
      status: "success" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Activité Récente</h2>
          <p className="text-sm text-muted-foreground">
            Dernières actions effectuées dans le système
          </p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir tout
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
