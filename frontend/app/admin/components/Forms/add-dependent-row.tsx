"use client";

import { useState } from "react";
import { Dependent } from "../../../../hooks/useDependents";
import { CheckIcon, XIcon } from "../../assets/icons";

interface AddDependentRowProps {
  onSave: (dependent: Dependent) => void;
  onCancel: () => void;
}

export default function AddDependentRow({
  onSave,
  onCancel,
}: AddDependentRowProps) {
  const [formData, setFormData] = useState<Partial<Dependent>>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "MALE",
    relation: "",
    nationalId: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Dependent, string>>
  >({});

  const handleInputChange = (field: keyof Dependent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Dependent, string>> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "Prénom requis";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Nom requis";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date de naissance requise";
    }

    if (!formData.relation?.trim()) {
      newErrors.relation = "Relation requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData as Dependent);
    }
  };

  return (
    <tr className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
      <td className="px-4 py-3">
        <div className="space-y-2">
          <input
            type="text"
            value={formData.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`w-full px-2 py-1 text-sm border rounded dark:border-strokedark dark:bg-boxdark ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Prénom"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
          <input
            type="text"
            value={formData.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`w-full px-2 py-1 text-sm border rounded dark:border-strokedark dark:bg-boxdark ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nom"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <input
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          className={`w-full px-2 py-1 text-sm border rounded dark:border-strokedark dark:bg-boxdark ${
            errors.dateOfBirth ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.dateOfBirth && (
          <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <select
          value={formData.gender || "MALE"}
          onChange={(e) => handleInputChange("gender", e.target.value)}
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
          value={formData.relation || ""}
          onChange={(e) => handleInputChange("relation", e.target.value)}
          className={`w-full px-2 py-1 text-sm border rounded dark:border-strokedark dark:bg-boxdark ${
            errors.relation ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Relation"
        />
        {errors.relation && (
          <p className="text-xs text-red-500 mt-1">{errors.relation}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={formData.nationalId || ""}
          onChange={(e) => handleInputChange("nationalId", e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark"
          placeholder="Numéro national"
        />
      </td>
      <td className="px-4 py-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive || false}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
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
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Sauvegarder"
          >
            <CheckIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Annuler"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
