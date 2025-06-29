"use client";

import { useState } from "react";
import { Policy } from "../../types/policy";

interface PolicyTableProps {
  policies: Policy[];
  onEdit: (policy: Policy) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
}

export function PolicyTable({
  policies,
  onEdit,
  onDelete,
  searchTerm,
}: PolicyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les polices
  const filteredPolicies = policies.filter((policy) => {
    return (
      policy.policyNumber
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.coverage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPolicies = filteredPolicies.slice(startIndex, endIndex);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
            Individuelle
          </span>
        );
      case "FAMILY":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            Famille
          </span>
        );
      case "GROUP":
        return (
          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
            Groupe
          </span>
        );
      case "ENTERPRISE":
        return (
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
            Entreprise
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

  const getStatusBadge = (validUntil: string) => {
    const endDate = new Date(validUntil);
    const now = new Date();

    if (endDate > now) {
      return (
        <span className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success">
          Actif
        </span>
      );
    } else {
      return (
        <span className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
          Expiré
        </span>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Numéro
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Couverture
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Statut
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Prime
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Franchise
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Validité
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {currentPolicies.map((policy) => (
            <tr
              key={policy.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-4 py-4">
                <div className="font-medium text-gray-900 dark:text-white">
                  {policy.policyNumber}
                </div>
              </td>
              <td className="px-4 py-4">{getTypeBadge(policy.type)}</td>
              <td className="px-4 py-4">
                <div className="text-gray-900 dark:text-white">
                  {policy.coverage}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {policy.description}
                </div>
              </td>
              <td className="px-4 py-4">{getStatusBadge(policy.validUntil)}</td>
              <td className="px-4 py-4">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(policy.premiumAmount)}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-gray-900 dark:text-white">
                  {formatCurrency(policy.deductible)}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  Jusqu'au {formatDate(policy.validUntil)}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(policy)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(policy.id!)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
              {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
