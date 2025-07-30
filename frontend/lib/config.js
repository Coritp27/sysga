// Configuration centralisée pour SYSGA
// Gère les variables d'environnement de manière sécurisée

export const config = {
  // Configuration du contrat
  contract: {
    address:
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
      "0x4fB79C396dd4A48376cFF5111A36adDd40f45d69",
  },

  // Configuration des réseaux
  networks: {
    sepolia: {
      chainId: 11155111,
      name: "Sepolia Testnet",
      rpcUrl:
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
        `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
      explorer: "https://sepolia.etherscan.io",
      contractAddress:
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
        "0x4fB79C396dd4A48376cFF5111A36adDd40f45d69",
    },
    localhost: {
      chainId: 1337,
      name: "Localhost",
      rpcUrl:
        process.env.NEXT_PUBLIC_LOCALHOST_RPC_URL || "http://localhost:8545",
      explorer: null,
      contractAddress:
        process.env.NEXT_PUBLIC_LOCALHOST_CONTRACT_ADDRESS ||
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    },
    polygonMumbai: {
      chainId: 80001,
      name: "Polygon Mumbai",
      rpcUrl:
        process.env.NEXT_PUBLIC_MUMBAI_RPC_URL ||
        `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
      explorer: "https://mumbai.polygonscan.com",
    },
  },

  // Réseau par défaut
  defaultNetwork: process.env.NEXT_PUBLIC_DEFAULT_NETWORK || "sepolia",

  // Configuration Infura
  infura: {
    projectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  },
};

// Fonction pour obtenir la configuration d'un réseau
export const getNetworkConfig = (chainId) => {
  const network = Object.values(config.networks).find(
    (network) => network.chainId === chainId
  );
  return network || config.networks[config.defaultNetwork];
};

// Fonction pour obtenir l'adresse du contrat pour un réseau
export const getContractAddress = (chainId) => {
  const network = getNetworkConfig(chainId);
  return network?.contractAddress || config.contract.address;
};

// Fonction pour vérifier si un réseau est supporté
export const isSupportedNetwork = (chainId) => {
  return Object.values(config.networks).some(
    (network) => network.chainId === chainId
  );
};
