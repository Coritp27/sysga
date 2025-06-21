"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "../../assets/icons";
import dayjs from "dayjs";

interface BlockchainReference {
  id: number;
  referenceId: string;
  type: "POLICY" | "CARD" | "CLAIM" | "PAYMENT";
  status: "CONFIRMED" | "PENDING" | "FAILED";
  blockNumber: string;
  transactionHash: string;
  relatedEntity: {
    type: string;
    id: string;
    name: string;
  };
  createdAt: string;
  confirmedAt?: string;
}

interface BlockchainReferenceTableProps {
  searchTerm: string;
}

// Données statiques pour les références blockchain
const mockBlockchainReferences: BlockchainReference[] = [
  {
    id: 1,
    referenceId: "REF-2024-001",
    type: "POLICY",
    status: "CONFIRMED",
    blockNumber: "0x1234567890abcdef",
    transactionHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    relatedEntity: {
      type: "Police",
      id: "POL-2024-001",
      name: "Jean Dupont",
    },
    createdAt: "2024-01-15",
    confirmedAt: "2024-01-15",
  },
  {
    id: 2,
    referenceId: "REF-2024-002",
    type: "CARD",
    status: "CONFIRMED",
    blockNumber: "0x1234567890abcdef",
    transactionHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    relatedEntity: {
      type: "Carte",
      id: "CARD-2024-001",
      name: "Marie Martin",
    },
    createdAt: "2024-02-15",
    confirmedAt: "2024-02-15",
  },
  {
    id: 3,
    referenceId: "REF-2024-003",
    type: "CLAIM",
    status: "PENDING",
    blockNumber: "0xabcdef1234567890",
    transactionHash:
      "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    relatedEntity: {
      type: "Réclamation",
      id: "CLAIM-2024-001",
      name: "Pierre Durand",
    },
    createdAt: "2024-03-01",
  },
  {
    id: 4,
    referenceId: "REF-2024-004",
    type: "PAYMENT",
    status: "CONFIRMED",
    blockNumber: "0x4567890abcdef123",
    transactionHash:
      "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    relatedEntity: {
      type: "Paiement",
      id: "PAY-2024-001",
      name: "Sophie Leroy",
    },
    createdAt: "2024-02-28",
    confirmedAt: "2024-02-28",
  },
  {
    id: 5,
    referenceId: "REF-2024-005",
    type: "POLICY",
    status: "FAILED",
    blockNumber: "0x7890abcdef123456",
    transactionHash:
      "0xabc1234567890defabc1234567890defabc1234567890defabc1234567890def",
    relatedEntity: {
      type: "Police",
      id: "POL-2024-005",
      name: "Lucas Moreau",
    },
    createdAt: "2024-03-10",
  },
];

export function BlockchainReferenceTable({
  searchTerm,
}: BlockchainReferenceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les références blockchain
  const filteredReferences = mockBlockchainReferences.filter((reference) => {
    return (
      reference.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reference.relatedEntity.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reference.relatedEntity.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reference.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredReferences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReferences = filteredReferences.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success">
            Confirmé
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
            En attente
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex rounded-full bg-danger bg-opacity-10 px-3 py-1 text-sm font-medium text-danger">
            Échoué
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
      case "POLICY":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            Police
          </span>
        );
      case "CARD":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
            Carte
          </span>
        );
      case "CLAIM":
        return (
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
            Réclamation
          </span>
        );
      case "PAYMENT":
        return (
          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
            Paiement
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
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Référence
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Type
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Entité Liée
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Bloc
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Transaction
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Créée le
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReferences.map((reference) => (
              <tr
                key={reference.id}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {reference.referenceId}
                  </h5>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getTypeBadge(reference.type)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <h5 className="font-medium text-black dark:text-white">
                    {reference.relatedEntity.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {reference.relatedEntity.id}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getStatusBadge(reference.status)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white font-mono text-sm">
                    {truncateHash(reference.blockNumber)}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white font-mono text-sm">
                    {truncateHash(reference.transactionHash)}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-sm text-black dark:text-white">
                    {formatDate(reference.createdAt)}
                  </p>
                  {reference.confirmedAt && (
                    <p className="text-xs text-muted-foreground">
                      Confirmé: {formatDate(reference.confirmedAt)}
                    </p>
                  )}
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
            {Math.min(endIndex, filteredReferences.length)} sur{" "}
            {filteredReferences.length} résultats
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
