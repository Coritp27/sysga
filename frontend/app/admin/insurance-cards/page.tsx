"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import InsuranceCardTable from "../components/Tables/insurance-card-table";
import { AddIcon, SearchIcon, RefreshCwIcon } from "../assets/icons";
import { InsuranceCardForm } from "../components/Forms/insurance-card-form";
import { ConfirmationModal } from "../components/ui/confirmation-modal";
import WalletConnectionModal from "../components/ui/wallet-connection-modal";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useInsuranceCards } from "@/hooks/useInsuranceCards";

export default function InsuranceCardsPage() {
  const { user, isLoading: workspaceLoading } = useWorkspace();
  const { isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCard, setEditingCard] = useState<any>(null);
  const [deletingCard, setDeletingCard] = useState<any>(null);

  // Hook pour récupérer les cartes d'assurance depuis l'API
  const {
    cards: insuranceCards,
    isLoading,
    error,
    refetch,
  } = useInsuranceCards();

  // Filtrer les cartes selon le terme de recherche
  const filteredCards = insuranceCards.filter(
    (card) =>
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.insuredPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.policyNumber.toString().includes(searchTerm.toLowerCase()) ||
      card.insuranceCompany.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Calculer les statistiques
  const totalCards = insuranceCards.length;
  const activeCards = insuranceCards.filter(
    (card: any) => card.status === "ACTIVE"
  ).length;
  const expiredCards = insuranceCards.filter(
    (card: any) => card.status === "REVOKED"
  ).length;
  const newThisMonth = insuranceCards.filter((card: any) => {
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
    setTimeout(() => refetch(), 1000);
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
    // Vérifier si le wallet est connecté
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

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

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
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

  if (workspaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
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
            className="inline-flex items-center justify-center rounded-md px-10 py-2 text-center font-medium lg:px-8 xl:px-10 bg-primary text-white hover:bg-opacity-90"
          >
            <AddIcon className="mr-2 h-4 w-4" />
            Nouvelle Carte
          </button>
        </div>
      </div>

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
                Erreur blockchain
              </p>
              <p className="text-xs text-red-600 dark:text-red-300">
                {error.toString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black dark:text-white">
                Total des Cartes
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {totalCards}
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
              <p className="text-sm font-medium text-black dark:text-white">
                Cartes Actives
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {activeCards}
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
              <p className="text-sm font-medium text-black dark:text-white">
                Cartes Expirées
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {expiredCards}
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
              <p className="text-sm font-medium text-black dark:text-white">
                Nouvelles ce Mois
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {newThisMonth}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une carte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredCards.length} carte(s) trouvée(s)
        </div>
      </div>

      {/* Table des cartes */}
      <InsuranceCardTable
        cards={filteredCards}
        onEdit={openEditForm}
        onDelete={openDeleteModal}
      />

      {/* Formulaire modal */}
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
        title="Supprimer la carte d'assurance"
        message={`Êtes-vous sûr de vouloir supprimer la carte ${deletingCard?.cardNumber} ? Cette action ne peut pas être annulée.`}
      />

      {/* Modal de connexion wallet */}
      <WalletConnectionModal
        isOpen={isWalletModalOpen}
        onClose={closeWalletModal}
        title="Connexion Wallet Requise"
        message="Connectez votre wallet pour créer une nouvelle carte d'assurance sur la blockchain"
      />
    </div>
  );
}
