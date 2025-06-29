"use client";

import { useState } from "react";
import { Dependent } from "../../../../hooks/useDependents";
import { AddIcon, TrashIcon, PencilSquareIcon } from "../../assets/icons";
import AddDependentRow from "./add-dependent-row";

interface DependentsDynamicTableProps {
  dependents: Dependent[];
  onAdd: (dependent: Dependent) => void;
  onEdit: (dependent: Dependent, index: number) => void;
  onDelete: (index: number) => void;
}

export default function DependentsDynamicTable({
  dependents,
  onAdd,
  onEdit,
  onDelete,
}: DependentsDynamicTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Dependent | null>(null);
  const [showAddRow, setShowAddRow] = useState(false);

  const handleEdit = (dependent: Dependent, index: number) => {
    setEditingIndex(index);
    setEditingData({ ...dependent });
  };

  const handleSave = () => {
    if (editingData && editingIndex !== null) {
      onEdit(editingData, editingIndex);
      setEditingIndex(null);
      setEditingData(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingData(null);
  };

  const handleInputChange = (field: keyof Dependent, value: any) => {
    if (editingData) {
      setEditingData({ ...editingData, [field]: value });
    }
  };

  const handleAddDependent = (dependent: Dependent) => {
    onAdd(dependent);
    setShowAddRow(false);
  };

  const handleCancelAdd = () => {
    setShowAddRow(false);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-black dark:text-white">
          Dépendants ({dependents.length})
        </h4>
        {!showAddRow && (
          <button
            type="button"
            onClick={() => setShowAddRow(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <AddIcon className="mr-2 h-4 w-4" />
            Ajouter
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-strokedark rounded-lg">
          <thead className="bg-gray-50 dark:bg-meta-4">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                Nom complet
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                Date de naissance
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                Genre
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                Relation
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                Numéro national
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-strokedark">
            {/* Ligne d'ajout */}
            {showAddRow && (
              <AddDependentRow
                onSave={handleAddDependent}
                onCancel={handleCancelAdd}
              />
            )}

            {/* Lignes des dépendants existants */}
            {dependents.map((dependent, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-meta-4">
                {editingIndex === index ? (
                  // Mode édition
                  <>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingData?.firstName || ""}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark"
                          placeholder="Prénom"
                        />
                        <input
                          type="text"
                          value={editingData?.lastName || ""}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark"
                          placeholder="Nom"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={editingData?.dateOfBirth || ""}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={editingData?.gender || "MALE"}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark"
                      >
                        <option value="MALE">Homme</option>
                        <option value="FEMALE">Femme</option>
                        <option value="OTHER">Autre</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editingData?.relation || ""}
                        onChange={(e) =>
                          handleInputChange("relation", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark"
                        placeholder="Relation"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editingData?.nationalId || ""}
                        onChange={(e) =>
                          handleInputChange("nationalId", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark"
                        placeholder="Numéro national"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingData?.isActive || false}
                          onChange={(e) =>
                            handleInputChange("isActive", e.target.checked)
                          }
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-sm">Actif</span>
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="px-2 py-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Sauvegarder
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          Annuler
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // Mode affichage
                  <>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {dependent.firstName} {dependent.lastName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-black dark:text-white">
                        {formatDate(dependent.dateOfBirth)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-black dark:text-white">
                        {getGenderLabel(dependent.gender)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-black dark:text-white">
                        {dependent.relation}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-black dark:text-white">
                        {dependent.nationalId || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-2 text-xs font-medium ${
                          dependent.isActive
                            ? "bg-success text-success"
                            : "bg-danger text-danger"
                        }`}
                      >
                        {dependent.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(dependent, index)}
                          className="hover:text-primary"
                          title="Modifier"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(index)}
                          className="hover:text-danger"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dependents.length === 0 && !showAddRow && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-strokedark rounded-lg">
          <p>Aucun dépendant ajouté</p>
          <p className="text-sm">
            Cliquez sur "Ajouter" pour créer un nouveau dépendant
          </p>
        </div>
      )}
    </div>
  );
}
