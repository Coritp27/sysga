import React from "react";
import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import InsuredPersonTable from "../components/Tables/InsuredPersonTable";

export const metadata: Metadata = {
  title: "Personnes Assurées - SYSGA Admin",
  description: "Gestion des personnes assurées dans le système",
};

const InsuredPersonsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Personnes Assurées" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Personnes Assurées
            </h1>
            <p className="text-muted-foreground">
              Gérez toutes les personnes assurées dans le système
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>+</span>
            <span>Nouvelle Personne</span>
          </button>
        </div>

        <InsuredPersonTable />
      </div>
    </>
  );
};

export default InsuredPersonsPage;
