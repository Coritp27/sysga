"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "../../assets/icons";
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
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.insuredPerson.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      policy.insuredPerson.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      policy.insuranceCompany.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
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
      case "INACTIVE":
        return (
          <span className="inline-flex rounded-full bg-danger bg-opacity-10 px-3 py-1 text-sm font-medium text-danger">
            Inactif
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
            Expiré
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            En attente
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            Annulée
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
              Police
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Assuré
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Compagnie
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Statut
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Prime
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Couverture
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Période
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
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {policy.policyNumber}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Créée le {formatDate(policy.createdAt)}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {policy.insuredPerson.firstName}{" "}
                    {policy.insuredPerson.lastName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {policy.insuredPerson.email}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-gray-900 dark:text-white">
                  {policy.insuranceCompany.name}
                </div>
              </td>
              <td className="px-4 py-4">{getTypeBadge(policy.type)}</td>
              <td className="px-4 py-4">{getStatusBadge(policy.status)}</td>
              <td className="px-4 py-4">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(policy.premium)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  par an
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(policy.coverage)}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => onEdit(policy)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    title="Modifier"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => policy.id && onDelete(policy.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(endIndex, filteredPolicies.length)} sur{" "}
            {filteredPolicies.length} résultats
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Précédent
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
