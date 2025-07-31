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
import { ChainError } from "@/components/ui/ChainError";

export default function InsuranceCardsPage() {
  const { isLoading: workspaceLoading } = useWorkspace();
  const { isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCard, setEditingCard] = useState<any>(null);
  const [deletingCard, setDeletingCard] = useState<any>(null);

  // Hook pour récupérer les cartes d'assurance depuis l'API
  const { cards: insuranceCards, isLoading, refetch } = useInsuranceCards();

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
      closeDeleteModal();
      // Rafraîchir les données après suppression
      setTimeout(() => refetch(), 1000);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Afficher un loader pendant le chargement
  if (workspaceLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <ChainError>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Cartes d'Assurance
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
            >
              <RefreshCwIcon className="h-4 w-4" />
              Actualiser
            </button>
            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              <AddIcon className="h-4 w-4" />
              Nouvelle Carte
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Total Cartes
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {totalCards}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Cartes Actives
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeCards}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Cartes Révoquées
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {expiredCards}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Nouvelles ce Mois
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {newThisMonth}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des cartes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:focus:bg-dark-3"
            />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Table des cartes */}
        <InsuranceCardTable
          cards={filteredCards}
          onEdit={openEditForm}
          onDelete={openDeleteModal}
        />

        {/* Modals */}
        {isFormOpen && (
          <InsuranceCardForm
            isOpen={isFormOpen}
            onClose={closeForm}
            onSubmit={handleFormSubmit}
            initialData={editingCard}
            mode={formMode}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={confirmDelete}
            title="Supprimer la carte d'assurance"
            message={`Êtes-vous sûr de vouloir supprimer la carte ${deletingCard?.cardNumber} ?`}
          />
        )}

        {isWalletModalOpen && (
          <WalletConnectionModal
            isOpen={isWalletModalOpen}
            onClose={closeWalletModal}
          />
        )}
      </div>
    </ChainError>
  );
}
