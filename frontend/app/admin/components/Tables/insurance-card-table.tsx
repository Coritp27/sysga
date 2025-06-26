"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { TrashIcon } from "lucide-react";
import { PencilSquareIcon } from "../../assets/icons";
import { FormattedCard } from "@/services/blockchain-card.service";

interface InsuranceCardTableProps {
  insuranceCards: FormattedCard[];
  onEdit?: (card: any) => void;
  onDelete?: (card: any) => void;
  isLoading?: boolean;
}

const InsuranceCardTable = ({
  insuranceCards,
  onEdit,
  onDelete,
  isLoading = false,
}: InsuranceCardTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination
  const totalPages = Math.ceil(insuranceCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCards = insuranceCards.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        text: "Active",
      },
      INACTIVE: {
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        text: "Inactive",
      },
      EXPIRED: {
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        text: "Expirée",
      },
      SUSPENDED: {
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
        text: "Suspendue",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.INACTIVE;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-muted-foreground">
            Chargement des cartes blockchain...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Numéro de Carte
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Assuré
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Police
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Validité
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Compagnie
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCards.map((card) => (
              <tr
                key={card.id}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {card.cardNumber}
                  </h5>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <h5 className="font-medium text-black dark:text-white">
                    {card.insuredPersonName}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {card.insuredPersonEmail}
                  </p>
                  {card.enterprise && (
                    <p className="text-xs text-muted-foreground">
                      {card.enterprise}
                    </p>
                  )}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {card.policyNumber}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getStatusBadge(card.status)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-sm text-black dark:text-white">
                    {dayjs(card.policyEffectiveDate).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expire: {dayjs(card.expiryDate).format("DD/MM/YYYY")}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {card.insuranceCompany}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <div className="flex items-center space-x-3.5">
                    {onEdit && (
                      <button
                        className="hover:text-primary"
                        onClick={() => onEdit(card)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="hover:text-danger"
                        onClick={() => onDelete(card)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke px-4 py-3 dark:border-strokedark sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Affichage de{" "}
                <span className="font-medium">{startIndex + 1}</span> à{" "}
                <span className="font-medium">
                  {Math.min(endIndex, insuranceCards.length)}
                </span>{" "}
                sur <span className="font-medium">{insuranceCards.length}</span>{" "}
                résultats
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Précédent</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === currentPage
                          ? "z-10 bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Suivant</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCardTable;
