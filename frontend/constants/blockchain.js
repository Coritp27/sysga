// Configuration blockchain pour VeriCarte
// Mettre à jour ces valeurs après déploiement du contrat

export const BLOCKCHAIN_CONFIG = {
  // Réseaux supportés
  networks: {
    // Réseau local (développement)
    localhost: {
      chainId: 1337,
      name: "Localhost",
      rpcUrl: "http://localhost:8545",
      explorer: null,
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Contrat déployé localement
    },

    // Sepolia (testnet - recommandé pour les beta testeurs)
    sepolia: {
      chainId: 11155111,
      name: "Sepolia",
      rpcUrl: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // RPC public Infura
      explorer: "https://sepolia.etherscan.io",
      contractAddress: "0x4fB79C396dd4A48376cFF5111A36adDd40f45d69", // ⚠️ Mettre à jour après redéploiement
    },

    // Ethereum mainnet (production)
    mainnet: {
      chainId: 1,
      name: "Ethereum",
      rpcUrl: "https://mainnet.infura.io/v3/YOUR-PROJECT-ID", // À configurer
      explorer: "https://etherscan.io",
      contractAddress: "0x...", // À remplacer par l'adresse déployée
    },

    // Polygon Mumbai (testnet alternatif)
    mumbai: {
      chainId: 80001,
      name: "Polygon Mumbai",
      rpcUrl: "https://polygon-mumbai.infura.io/v3/YOUR-PROJECT-ID", // À configurer
      explorer: "https://mumbai.polygonscan.com",
      contractAddress: "0x...", // À remplacer par l'adresse déployée
    },
  },

  // Configuration par défaut
  defaultNetwork: "sepolia", // Réseau par défaut pour les beta testeurs

  // Configuration du contrat
  contract: {
    name: "SysGa",
    abi: null, // Sera généré automatiquement
    bytecode: null, // Sera généré automatiquement
  },
};

// Fonction pour obtenir la configuration du réseau actuel
export const getNetworkConfig = (chainId) => {
  const network = Object.values(BLOCKCHAIN_CONFIG.networks).find(
    (network) => network.chainId === chainId
  );
  return (
    network || BLOCKCHAIN_CONFIG.networks[BLOCKCHAIN_CONFIG.defaultNetwork]
  );
};

// Fonction pour vérifier si un réseau est supporté
export const isSupportedNetwork = (chainId) => {
  return Object.values(BLOCKCHAIN_CONFIG.networks).some(
    (network) => network.chainId === chainId
  );
};

// Fonction pour obtenir l'adresse du contrat pour un réseau
export const getContractAddress = (chainId) => {
  const network = getNetworkConfig(chainId);
  return network?.contractAddress;
};
