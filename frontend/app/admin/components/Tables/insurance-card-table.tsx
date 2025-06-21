"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../../lib/utils";
import dayjs from "dayjs";
import { PreviewIcon } from "./icons";
import { TrashIcon } from "lucide-react";
import { PencilSquareIcon } from "../../assets/icons";

interface InsuranceCardTableProps {
  searchTerm: string;
}

const InsuranceCardTable = ({ searchTerm }: InsuranceCardTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Données mockées avec dates sous forme de chaînes ISO
  const insuranceCards = [
    {
      id: 1,
      cardNumber: "CARD-2024-001",
      insuredPersonName: "Jean Dupont",
      insuredPersonEmail: "jean.dupont@email.com",
      policyNumber: "POL-2024-001",
      policyEffectiveDate: "2024-01-01",
      expiryDate: "2024-12-31",
      status: "ACTIVE",
      insuranceCompany: "Assurance Plus",
      enterprise: "Tech Solutions",
    },
    {
      id: 2,
      cardNumber: "CARD-2024-002",
      insuredPersonName: "Marie Martin",
      insuredPersonEmail: "marie.martin@email.com",
      policyNumber: "POL-2024-002",
      policyEffectiveDate: "2024-02-15",
      expiryDate: "2025-02-14",
      status: "ACTIVE",
      insuranceCompany: "Santé Pro",
      enterprise: null,
    },
    {
      id: 3,
      cardNumber: "CARD-2023-001",
      insuredPersonName: "Pierre Durand",
      insuredPersonEmail: "pierre.durand@email.com",
      policyNumber: "POL-2023-001",
      policyEffectiveDate: "2023-12-01",
      expiryDate: "2023-12-31",
      status: "EXPIRED",
      insuranceCompany: "Groupe Assur",
      enterprise: "Innovation Corp",
    },
    {
      id: 4,
      cardNumber: "CARD-2024-003",
      insuredPersonName: "Sophie Leroy",
      insuredPersonEmail: "sophie.leroy@email.com",
      policyNumber: "POL-2024-003",
      policyEffectiveDate: "2024-03-01",
      expiryDate: "2025-02-28",
      status: "ACTIVE",
      insuranceCompany: "Assurance Plus",
      enterprise: null,
    },
    {
      id: 5,
      cardNumber: "CARD-2024-004",
      insuredPersonName: "Lucas Moreau",
      insuredPersonEmail: "lucas.moreau@email.com",
      policyNumber: "POL-2024-004",
      policyEffectiveDate: "2024-01-15",
      expiryDate: "2024-12-31",
      status: "INACTIVE",
      insuranceCompany: "Santé Pro",
      enterprise: "Digital Solutions",
    },
  ];

  // Filtrer les cartes
  const filteredCards = insuranceCards.filter((card) => {
    return (
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.insuredPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.insuranceCompany.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCards = filteredCards.slice(startIndex, endIndex);

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
          <span className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
            Inactif
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex rounded-full bg-danger bg-opacity-10 px-3 py-1 text-sm font-medium text-danger">
            Expiré
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

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Carte
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
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Compagnie
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
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
            {Math.min(endIndex, filteredCards.length)} sur{" "}
            {filteredCards.length} résultats
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
};

export default InsuranceCardTable;
