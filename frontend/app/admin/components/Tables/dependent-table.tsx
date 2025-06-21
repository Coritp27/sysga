"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "../../assets/icons";
import dayjs from "dayjs";

interface Dependent {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: "CHILD" | "SPOUSE" | "PARENT" | "OTHER";
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  insuredPerson: {
    firstName: string;
    lastName: string;
    email: string;
  };
  policyNumber: string;
  insuranceCardNumber?: string;
  createdAt: string;
}

interface DependentTableProps {
  searchTerm: string;
}

// Données statiques pour les dépendants
const mockDependents: Dependent[] = [
  {
    id: 1,
    firstName: "Emma",
    lastName: "Dupont",
    dateOfBirth: "2015-03-15",
    relationship: "CHILD",
    status: "ACTIVE",
    insuredPerson: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.com",
    },
    policyNumber: "POL-2024-001",
    insuranceCardNumber: "CARD-2024-001-01",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    firstName: "Sophie",
    lastName: "Martin",
    dateOfBirth: "1988-07-22",
    relationship: "SPOUSE",
    status: "ACTIVE",
    insuredPerson: {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@email.com",
    },
    policyNumber: "POL-2024-002",
    insuranceCardNumber: "CARD-2024-002-01",
    createdAt: "2024-02-15",
  },
  {
    id: 3,
    firstName: "Lucas",
    lastName: "Durand",
    dateOfBirth: "2018-11-08",
    relationship: "CHILD",
    status: "ACTIVE",
    insuredPerson: {
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@email.com",
    },
    policyNumber: "POL-2024-003",
    insuranceCardNumber: "CARD-2024-003-01",
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    firstName: "Claire",
    lastName: "Leroy",
    dateOfBirth: "1992-04-12",
    relationship: "SPOUSE",
    status: "INACTIVE",
    insuredPerson: {
      firstName: "Sophie",
      lastName: "Leroy",
      email: "sophie.leroy@email.com",
    },
    policyNumber: "POL-2024-004",
    createdAt: "2023-12-10",
  },
  {
    id: 5,
    firstName: "Antoine",
    lastName: "Moreau",
    dateOfBirth: "2010-09-30",
    relationship: "CHILD",
    status: "ACTIVE",
    insuredPerson: {
      firstName: "Lucas",
      lastName: "Moreau",
      email: "lucas.moreau@email.com",
    },
    policyNumber: "POL-2024-005",
    insuranceCardNumber: "CARD-2024-005-01",
    createdAt: "2024-01-25",
  },
];

export function DependentTable({ searchTerm }: DependentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les dépendants
  const filteredDependents = mockDependents.filter((dependent) => {
    return (
      dependent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dependent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dependent.insuredPerson.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dependent.insuredPerson.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dependent.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredDependents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDependents = filteredDependents.slice(startIndex, endIndex);

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

  const getRelationshipBadge = (relationship: string) => {
    switch (relationship) {
      case "CHILD":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
            Enfant
          </span>
        );
      case "SPOUSE":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            Conjoint
          </span>
        );
      case "PARENT":
        return (
          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
            Parent
          </span>
        );
      case "OTHER":
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            Autre
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {relationship}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const calculateAge = (dateOfBirth: string) => {
    return dayjs().diff(dayjs(dateOfBirth), "year");
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Dépendant
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Assuré Principal
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Relation
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Âge
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Police
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDependents.map((dependent) => (
              <tr
                key={dependent.id}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {dependent.firstName} {dependent.lastName}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Né(e) le {formatDate(dependent.dateOfBirth)}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <h5 className="font-medium text-black dark:text-white">
                    {dependent.insuredPerson.firstName}{" "}
                    {dependent.insuredPerson.lastName}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {dependent.insuredPerson.email}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getRelationshipBadge(dependent.relationship)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {calculateAge(dependent.dateOfBirth)} ans
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getStatusBadge(dependent.status)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {dependent.policyNumber}
                  </p>
                  {dependent.insuranceCardNumber && (
                    <p className="text-sm text-muted-foreground">
                      {dependent.insuranceCardNumber}
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
            {Math.min(endIndex, filteredDependents.length)} sur{" "}
            {filteredDependents.length} résultats
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
