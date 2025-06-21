"use client";

import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import InsuranceCompanyTable from "../components/Tables/InsuranceCompanyTable";
import { InsuranceCompanyForm } from "../components/Forms/insurance-company-form";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { InsuranceCompany } from "../types/insurance-company";

const InsuranceCompaniesPage = () => {
  const [insuranceCompanies, setInsuranceCompanies] = useState<
    InsuranceCompany[]
  >([
    {
      id: 1,
      name: "AXA Assurance",
      legalName: "AXA France IARD",
      registrationNumber: "FR123456789",
      taxId: "FR12345678901",
      email: "contact@axa.fr",
      phone1: "01 23 45 67 89",
      phone2: "01 23 45 67 90",
      website: "https://www.axa.fr",
      address: "25 avenue Matignon",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      industry: "Assurance",
      size: "ENTERPRISE",
      foundedYear: 1816,
      numberOfEmployees: 15000,
      annualRevenue: "15,000,000,000 €",
      contactPerson: {
        name: "Jean Dupont",
        position: "Directeur Commercial",
        email: "j.dupont@axa.fr",
        phone: "01 23 45 67 91",
      },
      financialInfo: {
        capital: "1,500,000,000 €",
        turnover: "15,000,000,000 €",
        rating: "AA",
        solvencyRatio: "180%",
      },
      coverageTypes: [
        "Assurance automobile",
        "Assurance habitation",
        "Assurance vie",
        "Assurance santé",
        "Assurance voyage",
      ],
      isActive: true,
    },
    {
      id: 2,
      name: "Allianz France",
      legalName: "Allianz France",
      registrationNumber: "FR987654321",
      taxId: "FR98765432109",
      email: "contact@allianz.fr",
      phone1: "01 98 76 54 32",
      phone2: "",
      website: "https://www.allianz.fr",
      address: "1 cours Michelet",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      industry: "Assurance",
      size: "ENTERPRISE",
      foundedYear: 1890,
      numberOfEmployees: 12000,
      annualRevenue: "12,000,000,000 €",
      contactPerson: {
        name: "Marie Martin",
        position: "Directrice Marketing",
        email: "m.martin@allianz.fr",
        phone: "01 98 76 54 33",
      },
      financialInfo: {
        capital: "1,200,000,000 €",
        turnover: "12,000,000,000 €",
        rating: "AA",
        solvencyRatio: "175%",
      },
      coverageTypes: [
        "Assurance automobile",
        "Assurance habitation",
        "Assurance vie",
        "Assurance santé",
        "Assurance professionnelle",
      ],
      isActive: true,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState<InsuranceCompany | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = insuranceCompanies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormMode("create");
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = (company: InsuranceCompany) => {
    setFormMode("edit");
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const company = insuranceCompanies.find((c) => c.id === id);
    if (company) {
      setSelectedCompany(company);
      setIsDeleteModalOpen(true);
    }
  };

  const handleSubmit = (data: InsuranceCompany) => {
    if (formMode === "create") {
      const newCompany = {
        ...data,
        id: Math.max(...insuranceCompanies.map((c) => c.id || 0)) + 1,
      };
      setInsuranceCompanies([...insuranceCompanies, newCompany]);
    } else {
      setInsuranceCompanies(
        insuranceCompanies.map((company) =>
          company.id === selectedCompany?.id
            ? { ...data, id: company.id }
            : company
        )
      );
    }
  };

  const confirmDelete = () => {
    if (selectedCompany?.id) {
      setInsuranceCompanies(
        insuranceCompanies.filter(
          (company) => company.id !== selectedCompany.id
        )
      );
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
    }
  };

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
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>+</span>
            <span>Nouvelle Compagnie</span>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Rechercher une compagnie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredCompanies.length} compagnie(s) trouvée(s)
          </div>
        </div>

        <InsuranceCompanyTable
          insuranceCompanies={filteredCompanies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Formulaire modal */}
      <InsuranceCompanyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCompany || undefined}
        mode={formMode}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la compagnie"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedCompany?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </>
  );
};

export default InsuranceCompaniesPage;
