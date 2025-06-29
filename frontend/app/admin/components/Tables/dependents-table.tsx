"use client";

import { useState } from "react";
import { Dependent } from "../../../../hooks/useDependents";
import { AddIcon, TrashIcon, PencilSquareIcon } from "../../assets/icons";

interface DependentsTableProps {
  dependents: Dependent[];
  onEdit: (dependent: Dependent) => void;
  onDelete: (dependentId: number) => void;
  onAdd: () => void;
  loading?: boolean;
}

export default function DependentsTable({
  dependents,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: DependentsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (dependentId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dépendant ?")) {
      setDeletingId(dependentId);
      try {
        await onDelete(dependentId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "Homme";
      case "FEMALE":
        return "Femme";
      case "OTHER":
        return "Autre";
      default:
        return gender;
    }
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-black dark:text-white">
            Dépendants
          </h3>
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <AddIcon className="mr-2 h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Dépendants ({dependents.length})
        </h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <AddIcon className="mr-2 h-4 w-4" />
          Ajouter
        </button>
      </div>

      {dependents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Aucun dépendant trouvé</p>
          <p className="text-sm">
            Cliquez sur "Ajouter" pour créer un nouveau dépendant
          </p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Nom complet
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Date de naissance
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  Genre
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Relation
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Statut
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dependents.map((dependent) => (
                <tr
                  key={dependent.id}
                  className="border-b border-[#eee] dark:border-strokedark"
                >
                  <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {dependent.firstName} {dependent.lastName}
                    </h5>
                    {dependent.nationalId && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {dependent.nationalId}
                      </p>
                    )}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {formatDate(dependent.dateOfBirth)}
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {getGenderLabel(dependent.gender)}
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {dependent.relation}
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <span
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        dependent.isActive
                          ? "bg-success text-success"
                          : "bg-danger text-danger"
                      }`}
                    >
                      {dependent.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => onEdit(dependent)}
                        className="hover:text-primary"
                        title="Modifier"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dependent.id!)}
                        disabled={deletingId === dependent.id}
                        className="hover:text-danger disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
}
