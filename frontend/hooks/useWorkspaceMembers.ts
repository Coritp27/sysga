import { useState, useEffect } from "react";

interface WorkspaceMember {
  id: number;
  username: string;
  userType: string;
  idClerk: string;
  email: string;
  walletAddress?: string;
  insuranceCompanyId?: number;
  isActive: boolean;
  roleId: number;
  role: {
    id: number;
    name: string;
    canRead: boolean;
    canWrite: boolean;
    permission: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  isDeleted: boolean;
}

interface InviteUserData {
  email: string;
  roleId?: number;
}

export const useWorkspaceMembers = () => {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les membres du workspace
  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/invite");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des membres");
      }
      const data = await response.json();
      setMembers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Inviter un utilisateur
  const inviteUser = async (
    inviteData: InviteUserData
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inviteData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'invitation");
      }

      // Recharger la liste des membres
      await fetchMembers();

      return {
        success: true,
        message: data.message,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Retirer un membre du workspace
  const removeMember = async (
    memberId: number
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/user/invite?memberId=${memberId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      // Recharger la liste des membres
      await fetchMembers();

      return {
        success: true,
        message: data.message,
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        message: err.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les membres au montage du composant
  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    isLoading,
    error,
    inviteUser,
    removeMember,
    refetch: fetchMembers,
  };
};
