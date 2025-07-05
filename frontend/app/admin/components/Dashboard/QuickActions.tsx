"use client";

import React from "react";
import {
  Plus,
  Users,
  CreditCard,
  Search,
  Shield,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const QuickAction = ({
  title,
  description,
  icon,
  href,
  color,
}: QuickActionProps) => (
  <Link href={href}>
    <div
      className={`group relative rounded-lg border p-6 hover:shadow-md transition-all duration-200 ${color}`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-white/90">
            {title}
          </h3>
          <p className="text-sm text-white/80 group-hover:text-white/70">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Plus className="h-5 w-5 text-white/60 group-hover:text-white/80 transition-colors" />
        </div>
      </div>
    </div>
  </Link>
);

const QuickActions = () => {
  const actions = [
    {
      title: "Nouvelle Carte",
      description: "Créer une carte d'assurance sur la blockchain",
      icon: <CreditCard className="h-6 w-6 text-white" />,
      href: "/admin/insurance-cards/new",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Nouvelle Personne",
      description: "Ajouter une personne assurée",
      icon: <Users className="h-6 w-6 text-white" />,
      href: "/admin/insured-persons/new",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Blockchain",
      description: "Voir les transactions blockchain",
      icon: <Shield className="h-6 w-6 text-white" />,
      href: "/admin/blockchain-references",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Recherche",
      description: "Rechercher dans les données",
      icon: <Search className="h-6 w-6 text-white" />,
      href: "/admin/search",
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Actions Rapides</h2>
        <p className="text-sm text-muted-foreground">
          Accédez rapidement aux fonctionnalités principales
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
