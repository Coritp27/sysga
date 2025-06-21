import React from "react";
import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import InsuranceCompanyTable from "../components/Tables/InsuranceCompanyTable";

export const metadata: Metadata = {
  title: "Compagnies d'Assurance - SYSGA Admin",
  description: "Gestion des compagnies d'assurance dans le système",
};

const InsuranceCompaniesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Compagnies d'Assurance" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Compagnies d'Assurance
            </h1>
            <p className="text-muted-foreground">
              Gérez toutes les compagnies d'assurance partenaires
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>+</span>
            <span>Nouvelle Compagnie</span>
          </button>
        </div>

        <InsuranceCompanyTable />
      </div>
    </>
  );
};

export default InsuranceCompaniesPage;
