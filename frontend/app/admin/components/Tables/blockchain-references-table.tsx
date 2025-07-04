import React, { useState } from "react";

interface BlockchainReference {
  id: number;
  reference: number;
  cardNumber: string;
  blockchainTxHash: string;
  createdAt: string;
  card?: {
    id: number;
    cardNumber: string;
    insuredPersonName: string;
    policyNumber: number;
    status: string;
    insuredPerson: {
      firstName: string;
      lastName: string;
      email: string;
      cin: string;
      nif: string;
    };
    insuranceCompany: {
      name: string;
    };
  };
}

interface BlockchainReferencesTableProps {
  references: BlockchainReference[];
  onEdit?: (reference: BlockchainReference) => void;
  onDelete?: (reference: BlockchainReference) => void;
  onView?: (reference: BlockchainReference) => void;
}

export function BlockchainReferencesTable({
  references,
  onEdit,
  onDelete,
  onView,
}: BlockchainReferencesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateHash = (hash: string) => {
    if (hash.length <= 20) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
  };

  if (references.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune référence blockchain trouvée</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Référence
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Numéro de Carte
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Transaction Hash
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Date de Création
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {references.map((reference) => (
            <React.Fragment key={reference.id}>
              <tr
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => toggleRow(reference.id)}
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div className="font-medium">#{reference.reference}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {reference.cardNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div className="font-mono text-xs">
                    {truncateHash(reference.blockchainTxHash)}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {formatDate(reference.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center space-x-2">
                    {onView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(reference);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Voir les détails"
                      >
                        <svg
                          className="h-4 w-4"
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
                    )}
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(reference);
                        }}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="Modifier"
                      >
                        <svg
                          className="h-4 w-4"
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
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(reference);
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Supprimer"
                      >
                        <svg
                          className="h-4 w-4"
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
                    )}
                  </div>
                </td>
              </tr>
              {expandedRows.has(reference.id) && reference.card && (
                <tr
                  key={reference.id + "-details"}
                  className="bg-gray-50 dark:bg-gray-800"
                >
                  <td colSpan={5} className="px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Informations de la Carte
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Statut:</span>{" "}
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                reference.card.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {reference.card.status}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Police:</span>{" "}
                            {reference.card.policyNumber}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Assuré
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Nom:</span>{" "}
                            {reference.card.insuredPerson.firstName}{" "}
                            {reference.card.insuredPerson.lastName}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {reference.card.insuredPerson.email}
                          </p>
                          <p>
                            <span className="font-medium">CIN:</span>{" "}
                            {reference.card.insuredPerson.cin}
                          </p>
                          <p>
                            <span className="font-medium">NIF:</span>{" "}
                            {reference.card.insuredPerson.nif}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Compagnie d'Assurance
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Nom:</span>{" "}
                            {reference.card.insuranceCompany.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
