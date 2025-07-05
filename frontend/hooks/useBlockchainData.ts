import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

interface BlockchainData {
  network: string;
  status: string;
  lastBlock: string;
  gasPrice: string;
  totalTransactions: number;
  recentTransactions: number;
  pendingTransactions: number;
  confirmationRate: number;
}

export const useBlockchainData = () => {
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Wagmi hooks
  const { isConnected } = useAccount();

  // Récupérer les données de la base de données
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        const response = await fetch("/api/dashboard/blockchain-status");
        if (response.ok) {
          const data = await response.json();
          setDbData(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données DB:", err);
      }
    };

    fetchDatabaseData();
  }, []);

  useEffect(() => {
    // Utiliser les données de la base de données avec le statut de connexion
    const combinedData: BlockchainData = {
      network: dbData?.network || "Ethereum Sepolia",
      status: isConnected ? "Connected" : "Disconnected",
      lastBlock: dbData?.lastBlock || "N/A",
      gasPrice: dbData?.gasPrice || "N/A",
      totalTransactions: dbData?.totalTransactions || 0,
      recentTransactions: dbData?.recentTransactions || 0,
      pendingTransactions: dbData?.pendingTransactions || 0,
      confirmationRate: dbData?.confirmationRate || 0,
    };

    setBlockchainData(combinedData);
    setLoading(false);
  }, [isConnected, dbData]);

  return {
    blockchainData,
    loading,
    error,
    isConnected,
  };
};
