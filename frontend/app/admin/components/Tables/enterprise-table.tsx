"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "../../assets/icons";

interface Enterprise {
  id: number;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  website?: string;
  fiscalNumber: string;
  numberOfEmployees: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}

interface EnterpriseTableProps {
  searchTerm: string;
  onEdit?: (enterprise: Enterprise) => void;
  onDelete?: (enterprise: Enterprise) => void;
}

// Données statiques pour les entreprises
const mockEnterprises: Enterprise[] = [
  {
    id: 1,
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    phone1: "+33 1 23 45 67 89",
    phone2: "+33 1 23 45 67 90",
    address: "123 Rue de la Tech, 75001 Paris",
    website: "https://techcorp.com",
    fiscalNumber: "FR12345678901",
    numberOfEmployees: 150,
    status: "ACTIVE",
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "GreenEnergy SARL",
    email: "info@greenenergy.fr",
    phone1: "+33 2 34 56 78 90",
    address: "456 Avenue des Énergies, 69000 Lyon",
    website: "https://greenenergy.fr",
    fiscalNumber: "FR98765432109",
    numberOfEmployees: 75,
    status: "ACTIVE",
    createdAt: "2023-03-22",
  },
  {
    id: 3,
    name: "Digital Marketing Pro",
    email: "hello@digitalmarketingpro.com",
    phone1: "+33 3 45 67 89 01",
    phone2: "+33 3 45 67 89 02",
    address: "789 Boulevard du Digital, 13000 Marseille",
    website: "https://digitalmarketingpro.com",
    fiscalNumber: "FR45678912345",
    numberOfEmployees: 45,
    status: "PENDING",
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    name: "Innovation Labs",
    email: "contact@innovationlabs.fr",
    phone1: "+33 4 56 78 90 12",
    address: "321 Rue de l'Innovation, 31000 Toulouse",
    website: "https://innovationlabs.fr",
    fiscalNumber: "FR78912345678",
    numberOfEmployees: 200,
    status: "ACTIVE",
    createdAt: "2022-11-08",
  },
  {
    id: 5,
    name: "StartupXYZ",
    email: "info@startupxyz.com",
    phone1: "+33 5 67 89 01 23",
    address: "654 Place de la Startup, 44000 Nantes",
    website: "https://startupxyz.com",
    fiscalNumber: "FR32165498701",
    numberOfEmployees: 25,
    status: "INACTIVE",
    createdAt: "2024-02-15",
  },
];

export function EnterpriseTable({
  searchTerm,
  onEdit,
  onDelete,
}: EnterpriseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les entreprises
  const filteredEnterprises = mockEnterprises.filter((enterprise) => {
    return (
      enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.fiscalNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEnterprises.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEnterprises = filteredEnterprises.slice(startIndex, endIndex);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Entreprise
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Contact
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Employés
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                N° Fiscal
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Date Création
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEnterprises.map((enterprise) => (
              <tr
                key={enterprise.id}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {enterprise.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {enterprise.address}
                  </p>
                  {enterprise.website && (
                    <a
                      href={enterprise.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {enterprise.website}
                    </a>
                  )}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {enterprise.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {enterprise.phone1}
                  </p>
                  {enterprise.phone2 && (
                    <p className="text-sm text-muted-foreground">
                      {enterprise.phone2}
                    </p>
                  )}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {enterprise.numberOfEmployees}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {enterprise.fiscalNumber}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getStatusBadge(enterprise.status)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {formatDate(enterprise.createdAt)}
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
                    {onEdit && (
                      <button
                        className="hover:text-primary"
                        onClick={() => onEdit(enterprise)}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="hover:text-danger"
                        onClick={() => onDelete(enterprise)}
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke py-4 px-4 dark:border-strokedark">
          <div className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(endIndex, filteredEnterprises.length)} sur{" "}
            {filteredEnterprises.length} résultats
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
