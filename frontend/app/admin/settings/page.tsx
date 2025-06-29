"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { WorkspaceMembers } from "../components/WorkspaceMembers";

export default function SettingsPage() {
  const { user, isLoading } = useWorkspace();
  const [activeTab, setActiveTab] = useState("company");

  // État pour les informations de la compagnie
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    email: "",
    phone1: "",
    phone2: "",
    address: "",
    website: "",
    fiscalNumber: "",
    numberOfEmployees: 0,
  });

  // Mettre à jour companyInfo quand user change
  useEffect(() => {
    if (user?.insuranceCompany) {
      setCompanyInfo({
        name: user.insuranceCompany.name || "",
        email: user.insuranceCompany.email || "",
        phone1: user.insuranceCompany.phone1 || "",
        phone2: user.insuranceCompany.phone2 || "",
        address: user.insuranceCompany.address || "",
        website: user.insuranceCompany.website || "",
        fiscalNumber: user.insuranceCompany.fiscalNumber || "",
        numberOfEmployees: user.insuranceCompany.numberOfEmployees || 0,
      });
    }
  }, [user?.insuranceCompany]);

  const handleCompanyChange = (key: string, value: any) => {
    setCompanyInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveCompany = async () => {
    try {
      const response = await fetch("/api/insurance-company/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyInfo),
      });

      if (response.ok) {
        alert("Informations de la compagnie mises à jour avec succès");
        // Recharger les données utilisateur pour avoir les infos à jour
        window.location.reload();
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const tabs = [
    { id: "company", label: "Compagnie", icon: "🏢" },
    { id: "members", label: "Membres", icon: "👥" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas associé à une compagnie, afficher un message
  if (!user?.insuranceCompany) {
    return (
      <>
        <Breadcrumb pageName="Paramètres" />
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune compagnie d'assurance associée
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Votre compte n'est pas encore associé à une compagnie d'assurance.
              {user?.message && (
                <span className="block mt-2 text-sm">{user.message}</span>
              )}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
              >
                Actualiser la page
              </button>
              <div className="text-xs text-gray-400">
                Si vous pensez qu'il s'agit d'une erreur, contactez
                l'administrateur.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Paramètres" />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Paramètres
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez votre compagnie d'assurance et vos collaborateurs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation des onglets */}
          <div className="lg:col-span-1">
            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-meta-4"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="lg:col-span-3">
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              {activeTab === "company" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      Informations de la Compagnie d'Assurance
                    </h3>
                    <button
                      onClick={handleSaveCompany}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                    >
                      Sauvegarder
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Nom de la compagnie *
                      </label>
                      <input
                        type="text"
                        value={companyInfo.name}
                        onChange={(e) =>
                          handleCompanyChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) =>
                          handleCompanyChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Téléphone principal *
                      </label>
                      <input
                        type="tel"
                        value={companyInfo.phone1}
                        onChange={(e) =>
                          handleCompanyChange("phone1", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Téléphone secondaire
                      </label>
                      <input
                        type="tel"
                        value={companyInfo.phone2}
                        onChange={(e) =>
                          handleCompanyChange("phone2", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        value={companyInfo.address}
                        onChange={(e) =>
                          handleCompanyChange("address", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={companyInfo.website}
                        onChange={(e) =>
                          handleCompanyChange("website", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Numéro fiscal *
                      </label>
                      <input
                        type="text"
                        value={companyInfo.fiscalNumber}
                        onChange={(e) =>
                          handleCompanyChange("fiscalNumber", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Nombre d'employés
                      </label>
                      <input
                        type="number"
                        value={companyInfo.numberOfEmployees}
                        onChange={(e) =>
                          handleCompanyChange(
                            "numberOfEmployees",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "members" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Membres de l'Entreprise
                  </h3>
                  <WorkspaceMembers user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
