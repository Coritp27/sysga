"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "../../assets/icons";

interface Policy {
  id: number;
  policyNumber: string;
  type: "INDIVIDUAL" | "FAMILY";
  coverage: string;
  deductible: number;
  premiumAmount: number;
  description: string;
  validUntil: string;
  insuranceCompany: string;
  status: "ACTIVE" | "EXPIRED" | "PENDING";
}

interface PolicyTableProps {
  searchTerm: string;
  selectedType: string;
}

// Données statiques pour les politiques
const mockPolicies: Policy[] = [
  {
    id: 1,
    policyNumber: "POL-2024-001",
    type: "INDIVIDUAL",
    coverage: "Complète",
    deductible: 500,
    premiumAmount: 1200,
    description: "Assurance santé individuelle complète",
    validUntil: "2025-12-31",
    insuranceCompany: "AXA Assurance",
    status: "ACTIVE",
  },
  {
    id: 2,
    policyNumber: "POL-2024-002",
    type: "FAMILY",
    coverage: "Basique",
    deductible: 1000,
    premiumAmount: 2400,
    description: "Assurance santé familiale basique",
    validUntil: "2025-06-30",
    insuranceCompany: "Allianz",
    status: "ACTIVE",
  },
  {
    id: 3,
    policyNumber: "POL-2024-003",
    type: "INDIVIDUAL",
    coverage: "Premium",
    deductible: 200,
    premiumAmount: 1800,
    description: "Assurance santé individuelle premium",
    validUntil: "2024-12-31",
    insuranceCompany: "CNP Assurances",
    status: "EXPIRED",
  },
  {
    id: 4,
    policyNumber: "POL-2024-004",
    type: "FAMILY",
    coverage: "Complète",
    deductible: 300,
    premiumAmount: 3600,
    description: "Assurance santé familiale complète",
    validUntil: "2025-12-31",
    insuranceCompany: "Groupama",
    status: "ACTIVE",
  },
  {
    id: 5,
    policyNumber: "POL-2024-005",
    type: "INDIVIDUAL",
    coverage: "Basique",
    deductible: 800,
    premiumAmount: 900,
    description: "Assurance santé individuelle basique",
    validUntil: "2025-03-15",
    insuranceCompany: "MAIF",
    status: "PENDING",
  },
];

export function PolicyTable({ searchTerm, selectedType }: PolicyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les politiques
  const filteredPolicies = mockPolicies.filter((policy) => {
    const matchesSearch =
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuranceCompany.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || policy.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPolicies = filteredPolicies.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success">
            Actif
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex rounded-full bg-danger bg-opacity-10 px-3 py-1 text-sm font-medium text-danger">
            Expiré
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
            En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {status}
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            Individuel
          </span>
        );
      case "FAMILY":
        return (
          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
            Familial
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Numéro de Police
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Type
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Couverture
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Franchise
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Prime
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Compagnie
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPolicies.map((policy) => (
              <tr
                key={policy.id}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {policy.policyNumber}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {policy.description}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getTypeBadge(policy.type)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {policy.coverage}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {policy.deductible}€
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {policy.premiumAmount}€
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {policy.insuranceCompany}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getStatusBadge(policy.status)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button className="hover:text-primary">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button className="hover:text-danger">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke py-4 px-4 dark:border-strokedark">
          <div className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(endIndex, filteredPolicies.length)} sur{" "}
            {filteredPolicies.length} résultats
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-stroke px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4"
            >
              Précédent
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-md border border-stroke px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
