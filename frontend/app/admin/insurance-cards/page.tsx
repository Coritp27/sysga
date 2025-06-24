"use client";
import { useState } from "react";
import InsuranceCardTable from "../components/Tables/insurance-card-table";
import { AddIcon, SearchIcon, RefreshCwIcon } from "../assets/icons";
import { InsuranceCardForm } from "../components/Forms/insurance-card-form";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import { useBlockchainCards } from "@/hooks/useBlockchainCards";
import { transformBlockchainCards } from "@/services/blockchain-card.service";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";

export default function InsuranceCardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCard, setEditingCard] = useState<any>(null);
  const [deletingCard, setDeletingCard] = useState<any>(null);

  // Hook pour récupérer les cartes blockchain
  const {
    cards: blockchainCards,
    isLoading,
    error,
    refetch,
    isConnected,
  } = useBlockchainCards();

  // Transformer les données blockchain pour l'interface
  const formattedCards = transformBlockchainCards(blockchainCards);

  // Filtrer les cartes selon le terme de recherche
  const filteredCards = formattedCards.filter(
    (card) =>
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.insuredPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.insuranceCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les statistiques
  const totalCards = formattedCards.length;
  const activeCards = formattedCards.filter(
    (card) => card.status === "ACTIVE"
  ).length;
  const expiredCards = formattedCards.filter(
    (card) => card.status === "EXPIRED"
  ).length;
  const newThisMonth = formattedCards.filter((card) => {
    const cardDate = new Date(card.policyEffectiveDate);
    const now = new Date();
    return (
      cardDate.getMonth() === now.getMonth() &&
      cardDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const handleCreateCard = (data: any) => {
    console.log("Créer une nouvelle carte d'assurance:", data);
    // La création se fait maintenant via le formulaire blockchain
    setIsFormOpen(false);
    // Rafraîchir les données après création
    setTimeout(() => refetch(), 2000);
  };

  const handleEditCard = (data: any) => {
    console.log("Modifier la carte d'assurance:", data);
    // Pour l'instant, on affiche juste dans la console
    // En production, on pourrait ajouter une fonction de modification sur le smart contract
  };

  const handleDeleteCard = (card: any) => {
    console.log("Supprimer la carte d'assurance:", card);
    // Pour l'instant, on affiche juste dans la console
    // En production, on pourrait ajouter une fonction de suppression sur le smart contract
  };

  const handleFormSubmit = (data: any) => {
    if (formMode === "create") {
      handleCreateCard(data);
    } else {
      handleEditCard(data);
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingCard(null);
    setIsFormOpen(true);
  };

  const openEditForm = (card: any) => {
    setFormMode("edit");
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const openDeleteModal = (card: any) => {
    setDeletingCard(card);
    setIsDeleteModalOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCard(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCard(null);
  };

  const confirmDelete = () => {
    if (deletingCard) {
      handleDeleteCard(deletingCard);
    }
    closeDeleteModal();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb avec ConnectButton */}
      <Breadcrumb pageName="Cartes d'Assurance (Blockchain)" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Cartes d'Assurance (Blockchain)
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4 disabled:opacity-50"
          >
            <RefreshCwIcon
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <AddIcon className="mr-2 h-4 w-4" />
            Nouvelle Carte
          </button>
        </div>
      </div>

      {/* Statut de connexion blockchain */}
      {!isConnected && (
        <div className="mb-6 rounded-sm border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Wallet non connecté
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300">
                Connectez votre wallet via le bouton en haut à droite pour voir
                vos cartes d'assurance sur la blockchain
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Erreur blockchain */}
      {error && (
        <div className="mb-6 rounded-sm border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Erreur de lecture blockchain
              </p>
              <p className="text-xs text-red-600 dark:text-red-300">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Cartes
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {isLoading ? "..." : totalCards}
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cartes Actives
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {isLoading ? "..." : activeCards}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
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
                Cartes Expirées
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {isLoading ? "..." : expiredCards}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nouvelles Ce Mois
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {isLoading ? "..." : newThisMonth}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Liste des Cartes d'Assurance (Blockchain)
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une carte..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10 w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <RefreshCwIcon className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">
                Chargement des cartes blockchain...
              </span>
            </div>
          </div>
        ) : (
          <InsuranceCardTable
            searchTerm={searchTerm}
            onEdit={openEditForm}
            onDelete={openDeleteModal}
            cards={filteredCards}
          />
        )}
      </div>

      {/* Modal de formulaire */}
      <InsuranceCardForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={editingCard}
        mode={formMode}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la carte "${deletingCard?.cardNumber}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
}
