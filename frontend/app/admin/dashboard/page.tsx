import React from "react";
import { Metadata } from "next";
import DashboardStats from "../components/Dashboard/DashboardStats";
import RecentActivity from "../components/Dashboard/RecentActivity";
import BlockchainStatus from "../components/Dashboard/BlockchainStatus";
import RecentCards from "../components/Dashboard/RecentCards";
import BlockchainInfo from "../components/Dashboard/BlockchainInfo";
import WalletStatus from "../components/Dashboard/WalletStatus";

export const metadata: Metadata = {
  title: "Dashboard - SYSGA",
  description:
    "Tableau de bord du système de gestion d'assurance avec blockchain",
};

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard SYSGA</h1>
        <p className="text-muted-foreground">
          Système de Gestion d'Assurance - Interface de gestion des cartes
          d'assurance avec intégration blockchain
        </p>
      </div>

      {/* Wallet Status */}
      <WalletStatus />

      {/* Blockchain Info */}
      <BlockchainInfo />

      {/* Stats Cards */}
      <DashboardStats />

      {/* Blockchain Status */}
      <BlockchainStatus />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Cards */}
        <RecentCards />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardPage;
