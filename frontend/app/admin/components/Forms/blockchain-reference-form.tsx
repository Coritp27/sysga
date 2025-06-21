import React, { useState, useEffect } from "react";
import { BlockchainReference } from "../../types/blockchain-reference";

interface BlockchainReferenceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BlockchainReference) => void;
  initialData?: BlockchainReference;
  mode: "create" | "edit";
}

interface BlockchainReferenceErrors {
  referenceId?: string;
  type?: string;
  status?: string;
  blockNumber?: string;
  transactionHash?: string;
  relatedEntity?: {
    type?: string;
    id?: string;
    name?: string;
  };
  createdAt?: string;
  confirmedAt?: string;
}

const typeOptions = [
  { value: "POLICY", label: "Police" },
  { value: "CARD", label: "Carte" },
  { value: "CLAIM", label: "Réclamation" },
  { value: "PAYMENT", label: "Paiement" },
];

const statusOptions = [
  { value: "CONFIRMED", label: "Confirmé" },
  { value: "PENDING", label: "En attente" },
  { value: "FAILED", label: "Échoué" },
];

export function BlockchainReferenceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: BlockchainReferenceFormProps) {
  const [formData, setFormData] = useState<BlockchainReference>({
    id: 0,
    referenceId: "",
    type: "POLICY",
    status: "CONFIRMED",
    blockNumber: "",
    transactionHash: "",
    relatedEntity: { type: "", id: "", name: "" },
    createdAt: "",
    confirmedAt: "",
    notes: "",
  });
  const [errors, setErrors] = useState<BlockchainReferenceErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: 0,
        referenceId: "",
        type: "POLICY",
        status: "CONFIRMED",
        blockNumber: "",
        transactionHash: "",
        relatedEntity: { type: "", id: "", name: "" },
        createdAt: "",
        confirmedAt: "",
        notes: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("relatedEntity.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        relatedEntity: { ...prev.relatedEntity, [field]: value },
      }));
      setErrors((prev) => ({
        ...prev,
        relatedEntity: { ...prev.relatedEntity, [field]: undefined },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: BlockchainReferenceErrors = {};
    if (!formData.referenceId.trim()) newErrors.referenceId = "Champ requis";
    if (!formData.type) newErrors.type = "Champ requis";
    if (!formData.status) newErrors.status = "Champ requis";
    if (!formData.blockNumber.trim()) newErrors.blockNumber = "Champ requis";
    if (!formData.transactionHash.trim())
      newErrors.transactionHash = "Champ requis";
    if (!formData.relatedEntity.type.trim())
      newErrors.relatedEntity = {
        ...newErrors.relatedEntity,
        type: "Champ requis",
      };
    if (!formData.relatedEntity.id.trim())
      newErrors.relatedEntity = {
        ...newErrors.relatedEntity,
        id: "Champ requis",
      };
    if (!formData.relatedEntity.name.trim())
      newErrors.relatedEntity = {
        ...newErrors.relatedEntity,
        name: "Champ requis",
      };
    if (!formData.createdAt) newErrors.createdAt = "Champ requis";
    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 0 &&
      (!newErrors.relatedEntity ||
        Object.keys(newErrors.relatedEntity).length === 0)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl dark:bg-boxdark">
        <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {mode === "create"
              ? "Nouvelle Référence Blockchain"
              : "Modifier la Référence"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                ID de Référence *
              </label>
              <input
                type="text"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.referenceId ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.referenceId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.referenceId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300 dark:border-strokedark dark:bg-boxdark"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statut *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300 dark:border-strokedark dark:bg-boxdark"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Numéro de Bloc *
              </label>
              <input
                type="text"
                name="blockNumber"
                value={formData.blockNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.blockNumber ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.blockNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.blockNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hash de Transaction *
              </label>
              <input
                type="text"
                name="transactionHash"
                value={formData.transactionHash}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.transactionHash ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.transactionHash && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.transactionHash}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Type d'Entité Liée *
              </label>
              <input
                type="text"
                name="relatedEntity.type"
                value={formData.relatedEntity.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.relatedEntity?.type ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.relatedEntity?.type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.relatedEntity.type}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ID Entité Liée *
              </label>
              <input
                type="text"
                name="relatedEntity.id"
                value={formData.relatedEntity.id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.relatedEntity?.id ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.relatedEntity?.id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.relatedEntity.id}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom Entité Liée *
              </label>
              <input
                type="text"
                name="relatedEntity.name"
                value={formData.relatedEntity.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.relatedEntity?.name ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.relatedEntity?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.relatedEntity.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date de Création *
              </label>
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.createdAt ? "border-red-500" : "border-gray-300 dark:border-strokedark dark:bg-boxdark"}`}
              />
              {errors.createdAt && (
                <p className="mt-1 text-sm text-red-500">{errors.createdAt}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date de Confirmation
              </label>
              <input
                type="date"
                name="confirmedAt"
                value={formData.confirmedAt || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300 dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300 dark:border-strokedark dark:bg-boxdark"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
            >
              {mode === "create" ? "Créer" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
