"use client";

import { useState } from "react";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { ConfirmationModal } from "./ui/confirmation-modal";

interface WorkspaceMembersProps {
  user: any; // Utilisateur connecté
}

export const WorkspaceMembers = ({ user }: WorkspaceMembersProps) => {
  const { members, isLoading, error, inviteUser, removeMember } =
    useWorkspaceMembers();
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(2); // Rôle par défaut
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);

  const roles = [
    { id: 1, name: "Administrateur", description: "Accès complet au système" },
    {
      id: 2,
      name: "Utilisateur Standard",
      description: "Accès en lecture et écriture",
    },
    { id: 3, name: "Lecteur", description: "Accès en lecture seule" },
  ];

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsInviting(true);
    setInviteMessage(null);

    const result = await inviteUser({ email: email.trim(), roleId });

    if (result.success) {
      setInviteMessage({ type: "success", message: result.message });
      setEmail("");
      setRoleId(2);
    } else {
      setInviteMessage({ type: "error", message: result.message });
    }

    setIsInviting(false);
  };

  const handleRemoveMember = (member: any) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const confirmRemoveMember = async () => {
    if (memberToDelete) {
      const result = await removeMember(memberToDelete.id);
      if (result.success) {
        setInviteMessage({ type: "success", message: result.message });
      } else {
        setInviteMessage({ type: "error", message: result.message });
      }
    }
    setDeleteModalOpen(false);
    setMemberToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message de feedback */}
      {inviteMessage && (
        <div
          className={`p-4 rounded-md ${
            inviteMessage.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
              : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          }`}
        >
          {inviteMessage.message}
        </div>
      )}

      {/* Formulaire d'invitation */}
      <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Inviter un nouveau membre
        </h3>

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Rôle
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isInviting || !email.trim()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInviting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Invitation en cours...
              </>
            ) : (
              "Inviter le membre"
            )}
          </button>
        </form>
      </div>

      {/* Liste des membres */}
      <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
        <div className="p-6 border-b border-stroke dark:border-strokedark">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Membres du workspace ({members.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérer les utilisateurs de votre compagnie d'assurance
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-boxdark divide-y divide-gray-200 dark:divide-gray-700">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {member.userType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.role.name === "Administrateur"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                          : member.role.name === "Utilisateur Standard"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200"
                      }`}
                    >
                      {member.role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(member.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      }`}
                    >
                      {member.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {member.idClerk !== user?.id && (
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Retirer du workspace"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {members.length === 0 && !isLoading && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucun membre trouvé dans le workspace
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmRemoveMember}
        title="Retirer le membre"
        message={`Êtes-vous sûr de vouloir retirer "${memberToDelete?.username}" du workspace ? Cette action est irréversible.`}
        confirmText="Retirer"
        cancelText="Annuler"
      />
    </div>
  );
};
