"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "../../assets/icons";
import dayjs from "dayjs";
import { Dependent } from "../../types/dependent";

interface DependentTableProps {
  searchTerm: string;
  dependents: Dependent[];
  onEdit?: (dependent: Dependent) => void;
  onDelete?: (dependent: Dependent) => void;
}

export function DependentTable({
  searchTerm,
  dependents,
  onEdit,
  onDelete,
}: DependentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les dépendants
  const filteredDependents = dependents.filter((dependent) => {
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
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Dépendant
            </th>
            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Relation
            </th>
            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Âge
            </th>
            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Statut
            </th>
            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
              Personne Assurée
            </th>
            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Police
            </th>
            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentDependents.map((dependent) => (
            <tr key={dependent.id}>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <div className="flex flex-col">
                  <h5 className="font-medium text-black dark:text-white">
                    {dependent.firstName} {dependent.lastName}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Né(e) le {formatDate(dependent.dateOfBirth)}
                  </p>
                </div>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {getRelationshipBadge(dependent.relationship)}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {calculateAge(dependent.dateOfBirth)} ans
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {getStatusBadge(dependent.status)}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="flex flex-col">
                  <h5 className="font-medium text-black dark:text-white">
                    {dependent.insuredPerson.firstName}{" "}
                    {dependent.insuredPerson.lastName}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {dependent.insuredPerson.email}
                  </p>
                </div>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="flex flex-col">
                  <p className="text-black dark:text-white font-medium">
                    {dependent.policyNumber}
                  </p>
                  {dependent.insuranceCardNumber && (
                    <p className="text-sm text-muted-foreground">
                      {dependent.insuranceCardNumber}
                    </p>
                  )}
                </div>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="flex items-center space-x-3.5">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(dependent)}
                      className="hover:text-primary"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(dependent)}
                      className="hover:text-danger"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke bg-white px-4 py-3 dark:border-strokedark dark:bg-boxdark sm:px-6">
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
                  {Math.min(endIndex, filteredDependents.length)}
                </span>{" "}
                sur{" "}
                <span className="font-medium">{filteredDependents.length}</span>{" "}
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
}
