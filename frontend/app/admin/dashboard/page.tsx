import React from "react";
import { Metadata } from "next";
import DashboardStats from "../components/Dashboard/DashboardStats";
import RecentActivity from "../components/Dashboard/RecentActivity";
import QuickActions from "../components/Dashboard/QuickActions";

export const metadata: Metadata = {
  title: "Dashboard - SYSGA Admin",
  description: "Tableau de bord principal du système de gestion d'assurance",
};

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'overview de votre système de gestion d'assurance
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default DashboardPage;
