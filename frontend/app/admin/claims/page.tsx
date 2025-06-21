"use client";

import { useState } from "react";
import { AddIcon, SearchIcon } from "../assets/icons";

interface Claim {
  id: number;
  claimNumber: string;
  type: "HEALTH" | "AUTO" | "PROPERTY" | "LIFE";
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "PAID";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  amount: number;
  description: string;
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  policy: {
    id: number;
    policyNumber: string;
  };
  submittedDate: string;
  reviewedDate?: string;
  paidDate?: string;
  notes?: string;
}

const initialClaims: Claim[] = [
  {
    id: 1,
    claimNumber: "CLM-2024-001",
    type: "HEALTH",
    status: "IN_REVIEW",
    priority: "HIGH",
    amount: 2500,
    description: "Fracture du bras droit suite à une chute",
    insuredPerson: {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.com",
    },
    policy: {
      id: 1,
      policyNumber: "POL-2024-001",
    },
    submittedDate: "2024-01-15",
    reviewedDate: "2024-01-18",
    notes: "Documents médicaux reçus, en attente de validation",
  },
  {
    id: 2,
    claimNumber: "CLM-2024-002",
    type: "AUTO",
    status: "APPROVED",
    priority: "MEDIUM",
    amount: 1800,
    description: "Accident de voiture - dommages à l'avant",
    insuredPerson: {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@email.com",
    },
    policy: {
      id: 2,
      policyNumber: "POL-2024-002",
    },
    submittedDate: "2024-01-10",
    reviewedDate: "2024-01-12",
    paidDate: "2024-01-15",
    notes: "Paiement effectué",
  },
  {
    id: 3,
    claimNumber: "CLM-2024-003",
    type: "PROPERTY",
    status: "PENDING",
    priority: "URGENT",
    amount: 5000,
    description: "Dégâts d'eau dans l'appartement",
    insuredPerson: {
      id: 3,
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@email.com",
    },
    policy: {
      id: 3,
      policyNumber: "POL-2024-003",
    },
    submittedDate: "2024-01-20",
    notes: "Expertise en cours",
  },
];

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.insuredPerson.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      claim.insuredPerson.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      claim.policy.policyNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;
    const matchesType = typeFilter === "all" || claim.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
            En attente
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            En cours
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success">
            Approuvée
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex rounded-full bg-danger bg-opacity-10 px-3 py-1 text-sm font-medium text-danger">
            Rejetée
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
            Payée
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
      case "HEALTH":
        return (
          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
            Santé
          </span>
        );
      case "AUTO":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            Auto
          </span>
        );
      case "PROPERTY":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
            Habitation
          </span>
        );
      case "LIFE":
        return (
          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
            Vie
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "LOW":
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            Faible
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600">
            Moyenne
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">
            Élevée
          </span>
        );
      case "URGENT":
        return (
          <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
            Urgente
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {priority}
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

  // Statistiques
  const totalClaims = claims.length;
  const pendingClaims = claims.filter((c) => c.status === "PENDING").length;
  const approvedClaims = claims.filter(
    (c) => c.status === "APPROVED" || c.status === "PAID"
  ).length;
  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Réclamations
        </h2>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
          <AddIcon className="mr-2 h-4 w-4" />
          Nouvelle Réclamation
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Réclamations
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {totalClaims}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                En Attente
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {pendingClaims}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Approuvées
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {approvedClaims}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Montant Total
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {totalAmount.toLocaleString()} €
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Liste des Réclamations
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une réclamation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="IN_REVIEW">En cours</option>
              <option value="APPROVED">Approuvée</option>
              <option value="REJECTED">Rejetée</option>
              <option value="PAID">Payée</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">Tous les types</option>
              <option value="HEALTH">Santé</option>
              <option value="AUTO">Auto</option>
              <option value="PROPERTY">Habitation</option>
              <option value="LIFE">Vie</option>
            </select>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  N° Réclamation
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Type
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Statut
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  Priorité
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Assuré
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Police
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Montant
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr
                  key={claim.id}
                  className="border-b border-[#eee] dark:border-strokedark"
                >
                  <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {claim.claimNumber}
                    </h5>
                  </td>
                  <td className="py-5 px-4 dark:bg-meta-4">
                    {getTypeBadge(claim.type)}
                  </td>
                  <td className="py-5 px-4 dark:bg-meta-4">
                    {getStatusBadge(claim.status)}
                  </td>
                  <td className="py-5 px-4 dark:bg-meta-4">
                    {getPriorityBadge(claim.priority)}
                  </td>
                  <td className="py-5 px-4 dark:bg-meta-4">
                    <h5 className="font-medium text-black dark:text-white">
                      {claim.insuredPerson.firstName}{" "}
                      {claim.insuredPerson.lastName}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {claim.insuredPerson.email}
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:bg-meta-4">
                    <p className="text-sm text-black dark:text-white">
                      {claim.policy.policyNumber}
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:bg-meta-4">
                    <p className="font-medium text-black dark:text-white">
                      {claim.amount.toLocaleString()} €
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:bg-meta-4">
                    <p className="text-sm text-black dark:text-white">
                      {formatDate(claim.submittedDate)}
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
                      <button className="hover:text-danger">
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
        </div>
      </div>
    </div>
  );
}
