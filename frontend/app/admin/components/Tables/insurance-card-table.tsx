"use client";

import React, { useState } from "react";
import { InsuranceCard } from "@/hooks/useInsuranceCards";

interface InsuranceCardTableProps {
  cards: InsuranceCard[];
  onEdit?: (card: InsuranceCard) => void;
  onDelete?: (card: InsuranceCard) => void;
  onView?: (card: InsuranceCard) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "INACTIVE":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "REVOKED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "REVOKED":
      return "Révoquée";
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

const truncateHash = (hash: string) => {
  if (!hash) return "";
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

const InsuranceCardTable = ({
  cards,
  onEdit,
  onDelete,
  onView,
}: InsuranceCardTableProps) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleExpanded = (cardId: number) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  // Protection contre undefined/null
  if (!cards || cards.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Aucune carte d'assurance trouvée.
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Carte d'Assurance
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Personne Assurée
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Police
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Validité
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Blockchain
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(cards ?? []).map((card) => (
              <>
                <tr
                  key={card.id}
                  className="border-b border-[#eee] dark:border-strokedark"
                >
                  <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex flex-col">
                      <h5 className="font-medium text-black dark:text-white">
                        {card.cardNumber}
                      </h5>
                      <p className="text-sm text-meta-3">
                        Émise le {formatDate(card.policyEffectiveDate)}
                      </p>
                    </div>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <div className="flex flex-col">
                      <h5 className="font-medium text-black dark:text-white">
                        {card.insuredPersonName}
                      </h5>
                      <p className="text-sm text-meta-3">
                        {card.insuredPerson.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      #{card.policyNumber}
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <span
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusColor(
                        card.status
                      )}`}
                    >
                      {getStatusLabel(card.status)}
                    </span>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {formatDate(card.validUntil)}
                    </p>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    {card.blockchainReference ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {truncateHash(
                            card.blockchainReference.blockchainTxHash
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        <span className="text-sm text-gray-500">Non liée</span>
                      </div>
                    )}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => toggleExpanded(card.id)}
                        className="hover:text-primary"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 9.00000C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 9.00000C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 9.00000Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      {onView && (
                        <button
                          onClick={() => onView(card)}
                          className="hover:text-primary"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H1.22227C0.969141 15.2719 0.772266 15.075 0.772266 14.8219V12.3187C0.772266 11.9656 0.462891 11.6719 0.125391 11.6719C-0.212109 11.6719 -0.521484 11.9531 -0.521484 12.3187V14.8219C0.537109 16.0688 1.74492 16.9594 3.17852 16.9594H13.6223C15.0559 16.9594 16.2637 16.0688 16.3223 14.8219V12.3187C16.3223 11.9531 16.0129 11.6719 16.8754 11.6719Z"
                              fill=""
                            />
                            <path
                              d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.18439 13.7257 7.79064 13.4726 7.53752C13.2195 7.28439 12.8257 7.28439 12.5726 7.53752L9.64762 10.4063V2.1094C9.64762 1.77189 9.33824 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.77189 8.35387 2.1094V10.4063L5.42887 7.53752C5.17574 7.28439 4.78199 7.28439 4.52887 7.53752C4.27574 7.79064 4.27574 8.18439 4.52887 8.43752L8.55074 12.3469Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(card)}
                          className="hover:text-primary"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H1.22227C0.969141 15.2719 0.772266 15.075 0.772266 14.8219V12.3187C0.772266 11.9656 0.462891 11.6719 0.125391 11.6719C-0.212109 11.6719 -0.521484 11.9531 -0.521484 12.3187V14.8219C0.537109 16.0688 1.74492 16.9594 3.17852 16.9594H13.6223C15.0559 16.9594 16.2637 16.0688 16.3223 14.8219V12.3187C16.3223 11.9531 16.0129 11.6719 16.8754 11.6719Z"
                              fill=""
                            />
                            <path
                              d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.18439 13.7257 7.79064 13.4726 7.53752C13.2195 7.28439 12.8257 7.28439 12.5726 7.53752L9.64762 10.4063V2.1094C9.64762 1.77189 9.33824 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.77189 8.35387 2.1094V10.4063L5.42887 7.53752C5.17574 7.28439 4.78199 7.28439 4.52887 7.53752C4.27574 7.79064 4.27574 8.18439 4.52887 8.43752L8.55074 12.3469Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(card)}
                          className="hover:text-danger"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {/* Détails étendus */}
                {expandedCard === card.id && (
                  <tr className="border-b border-[#eee] dark:border-strokedark">
                    <td
                      colSpan={7}
                      className="px-4 py-4 dark:border-strokedark"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium text-black dark:text-white mb-2">
                              Informations Personnelles
                            </h6>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Nom :</span>{" "}
                                {card.insuredPersonName}
                              </p>
                              <p>
                                <span className="font-medium">Email :</span>{" "}
                                {card.insuredPerson.email}
                              </p>
                              <p>
                                <span className="font-medium">CIN :</span>{" "}
                                {card.insuredPerson.cin}
                              </p>
                              <p>
                                <span className="font-medium">NIF :</span>{" "}
                                {card.insuredPerson.nif}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Date de naissance :
                                </span>{" "}
                                {formatDate(card.dateOfBirth)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium text-black dark:text-white mb-2">
                              Informations d'Assurance
                            </h6>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">
                                  Numéro de carte :
                                </span>{" "}
                                {card.cardNumber}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Numéro de police :
                                </span>{" "}
                                #{card.policyNumber}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Date d'effet :
                                </span>{" "}
                                {formatDate(card.policyEffectiveDate)}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Date de validité :
                                </span>{" "}
                                {formatDate(card.validUntil)}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Dépendants :
                                </span>{" "}
                                {card.hadDependent ? "Oui" : "Non"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium text-black dark:text-white mb-2">
                              Blockchain
                            </h6>
                            {card.blockchainReference ? (
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">
                                    Référence :
                                  </span>{" "}
                                  #{card.blockchainReference.reference}
                                </p>
                                <p>
                                  <span className="font-medium">Hash :</span>{" "}
                                  {card.blockchainReference.blockchainTxHash}
                                </p>
                                <p>
                                  <span className="font-medium">Créé le :</span>{" "}
                                  {formatDate(
                                    card.blockchainReference.createdAt
                                  )}
                                </p>
                                <a
                                  href={`https://sepolia.etherscan.io/tx/${card.blockchainReference.blockchainTxHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  Voir sur Etherscan →
                                </a>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Aucune référence blockchain
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsuranceCardTable;
