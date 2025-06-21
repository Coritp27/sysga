"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "../../assets/icons";
import dayjs from "dayjs";

interface MedicalInstitution {
  id: number;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  website?: string;
  fiscalNumber: string;
  numberOfEmployees: number;
  type: "HOSPITAL" | "CLINIC" | "LABORATORY" | "PHARMACY";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}

interface MedicalInstitutionTableProps {
  searchTerm: string;
}

// Données statiques pour les institutions médicales
const mockMedicalInstitutions: MedicalInstitution[] = [
  {
    id: 1,
    name: "Hôpital Saint-Joseph",
    email: "contact@hopital-saint-joseph.fr",
    phone1: "+33 1 42 34 56 78",
    phone2: "+33 1 42 34 56 79",
    address: "185 Rue Raymond Losserand, 75014 Paris",
    website: "https://hopital-saint-joseph.fr",
    fiscalNumber: "FR12345678901",
    numberOfEmployees: 1200,
    type: "HOSPITAL",
    status: "ACTIVE",
    createdAt: "2020-01-15",
  },
  {
    id: 2,
    name: "Clinique du Parc",
    email: "info@clinique-du-parc.fr",
    phone1: "+33 2 34 56 78 90",
    address: "456 Avenue du Parc, 69000 Lyon",
    website: "https://clinique-du-parc.fr",
    fiscalNumber: "FR98765432109",
    numberOfEmployees: 350,
    type: "CLINIC",
    status: "ACTIVE",
    createdAt: "2019-03-22",
  },
  {
    id: 3,
    name: "Laboratoire Médical Central",
    email: "contact@labo-central.fr",
    phone1: "+33 3 45 67 89 01",
    address: "789 Boulevard de la Santé, 13000 Marseille",
    website: "https://labo-central.fr",
    fiscalNumber: "FR45678912345",
    numberOfEmployees: 85,
    type: "LABORATORY",
    status: "ACTIVE",
    createdAt: "2021-06-10",
  },
  {
    id: 4,
    name: "Pharmacie Centrale",
    email: "info@pharmacie-centrale.fr",
    phone1: "+33 4 56 78 90 12",
    address: "321 Rue de la Pharmacie, 31000 Toulouse",
    website: "https://pharmacie-centrale.fr",
    fiscalNumber: "FR78912345678",
    numberOfEmployees: 45,
    type: "PHARMACY",
    status: "ACTIVE",
    createdAt: "2022-11-08",
  },
  {
    id: 5,
    name: "Centre Médical du Sud",
    email: "contact@centre-medical-sud.fr",
    phone1: "+33 5 67 89 01 23",
    address: "654 Avenue du Centre, 44000 Nantes",
    website: "https://centre-medical-sud.fr",
    fiscalNumber: "FR32165498701",
    numberOfEmployees: 280,
    type: "CLINIC",
    status: "PENDING",
    createdAt: "2024-02-15",
  },
];

export function MedicalInstitutionTable({
  searchTerm,
}: MedicalInstitutionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les institutions médicales
  const filteredInstitutions = mockMedicalInstitutions.filter((institution) => {
    return (
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.fiscalNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInstitutions = filteredInstitutions.slice(startIndex, endIndex);

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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "HOSPITAL":
        return (
          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
            Hôpital
          </span>
        );
      case "CLINIC":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            Clinique
          </span>
        );
      case "LABORATORY":
        return (
          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
            Laboratoire
          </span>
        );
      case "PHARMACY":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
            Pharmacie
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

  // Correction : formatage de la date à partir de la chaîne
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Institution
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Contact
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Type
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
                Créée le
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentInstitutions.map((institution) => (
              <tr
                key={institution.id}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {institution.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {institution.address}
                  </p>
                  {institution.website && (
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {institution.website}
                    </a>
                  )}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {institution.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {institution.phone1}
                  </p>
                  {institution.phone2 && (
                    <p className="text-sm text-muted-foreground">
                      {institution.phone2}
                    </p>
                  )}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getTypeBadge(institution.type)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {institution.numberOfEmployees}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {institution.fiscalNumber}
                  </p>
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  {getStatusBadge(institution.status)}
                </td>
                <td className="py-5 px-4 dark:bg-meta-4">
                  <p className="text-black dark:text-white">
                    {formatDate(institution.createdAt)}
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
            {Math.min(endIndex, filteredInstitutions.length)} sur{" "}
            {filteredInstitutions.length} résultats
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
