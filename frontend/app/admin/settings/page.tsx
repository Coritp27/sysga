"use client";

import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";

export default function SettingsPage() {
  const { user, isLoading } = useWorkspace();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      companyName: "SYSGA Insurance",
      language: "fr",
      timezone: "Europe/Paris",
      dateFormat: "DD/MM/YYYY",
      currency: "EUR",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      policyExpiryAlerts: true,
      claimUpdates: true,
      systemAlerts: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      ipWhitelist: "",
    },
    blockchain: {
      autoSync: true,
      syncInterval: 5,
      confirmationsRequired: 3,
      gasLimit: 21000,
      network: "mainnet",
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retentionDays: 30,
      cloudBackup: false,
    },
  });

  // État pour les informations de la compagnie
  const [companyInfo, setCompanyInfo] = useState({
    name: user?.insuranceCompany?.name || "",
    email: user?.insuranceCompany?.email || "",
    phone1: user?.insuranceCompany?.phone1 || "",
    phone2: user?.insuranceCompany?.phone2 || "",
    address: user?.insuranceCompany?.address || "",
    website: user?.insuranceCompany?.website || "",
    fiscalNumber: user?.insuranceCompany?.fiscalNumber || "",
    numberOfEmployees: user?.insuranceCompany?.numberOfEmployees || 0,
  });

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

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
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const tabs = [
    { id: "general", label: "Général", icon: "⚙️" },
    { id: "company", label: "Compagnie", icon: "🏢" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Sécurité", icon: "🔒" },
    { id: "blockchain", label: "Blockchain", icon: "⛓️" },
    { id: "backup", label: "Sauvegarde", icon: "💾" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Paramètres" />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Paramètres Système
          </h2>
          <div className="flex gap-4">
            <button className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-6 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4">
              Réinitialiser
            </button>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90">
              Enregistrer
            </button>
          </div>
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
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Paramètres Généraux
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        value={settings.general.companyName}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "companyName",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Langue
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "language",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "timezone",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      >
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">
                          America/New_York
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Devise
                      </label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "currency",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

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

                  {user?.insuranceCompany ? (
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
                          type="text"
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
                          type="text"
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
                          Nombre d'employés *
                        </label>
                        <input
                          type="number"
                          value={companyInfo.numberOfEmployees}
                          onChange={(e) =>
                            handleCompanyChange(
                              "numberOfEmployees",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        Aucune compagnie d'assurance associée à votre compte.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Contactez votre administrateur pour configurer votre
                        compagnie.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Paramètres de Notifications
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <label className="text-sm font-medium text-black dark:text-white">
                            {key === "emailNotifications"
                              ? "Notifications par email"
                              : key === "smsNotifications"
                                ? "Notifications par SMS"
                                : key === "pushNotifications"
                                  ? "Notifications push"
                                  : key === "policyExpiryAlerts"
                                    ? "Alertes d'expiration de police"
                                    : key === "claimUpdates"
                                      ? "Mises à jour de sinistres"
                                      : "Alertes système"}
                          </label>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              handleSettingChange(
                                "notifications",
                                key,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Paramètres de Sécurité
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Authentification à deux facteurs
                      </label>
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "twoFactorAuth",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Timeout de session (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "sessionTimeout",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "blockchain" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Paramètres Blockchain
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Synchronisation automatique
                      </label>
                      <input
                        type="checkbox"
                        checked={settings.blockchain.autoSync}
                        onChange={(e) =>
                          handleSettingChange(
                            "blockchain",
                            "autoSync",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Intervalle de synchronisation (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.blockchain.syncInterval}
                        onChange={(e) =>
                          handleSettingChange(
                            "blockchain",
                            "syncInterval",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Confirmations requises
                      </label>
                      <input
                        type="number"
                        value={settings.blockchain.confirmationsRequired}
                        onChange={(e) =>
                          handleSettingChange(
                            "blockchain",
                            "confirmationsRequired",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Réseau
                      </label>
                      <select
                        value={settings.blockchain.network}
                        onChange={(e) =>
                          handleSettingChange(
                            "blockchain",
                            "network",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      >
                        <option value="mainnet">Mainnet</option>
                        <option value="testnet">Testnet</option>
                        <option value="localhost">Localhost</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "backup" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Paramètres de Sauvegarde
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Sauvegarde automatique
                      </label>
                      <input
                        type="checkbox"
                        checked={settings.backup.autoBackup}
                        onChange={(e) =>
                          handleSettingChange(
                            "backup",
                            "autoBackup",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Fréquence de sauvegarde
                      </label>
                      <select
                        value={settings.backup.backupFrequency}
                        onChange={(e) =>
                          handleSettingChange(
                            "backup",
                            "backupFrequency",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                      >
                        <option value="daily">Quotidienne</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuelle</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
