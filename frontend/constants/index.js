// Configuration sécurisée avec variables d'environnement
export const contractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x4fB79C396dd4A48376cFF5111A36adDd40f45d69";

export const networkConfig = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl:
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
    explorer: "https://sepolia.etherscan.io",
  },
  polygonMumbai: {
    chainId: 80001,
    name: "Polygon Mumbai",
    rpcUrl:
      process.env.NEXT_PUBLIC_MUMBAI_RPC_URL ||
      `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
    explorer: "https://mumbai.polygonscan.com",
  },
  localhost: {
    chainId: 1337,
    name: "Localhost",
    rpcUrl:
      process.env.NEXT_PUBLIC_LOCALHOST_RPC_URL || "http://localhost:8545",
    explorer: null,
  },
};

export const contractAbi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_cardNumber",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_issuedOn",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_status",
        type: "string",
      },
      {
        internalType: "address",
        name: "_insuranceCompany",
        type: "address",
      },
    ],
    name: "addInsuranceCard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_insuranceCompany",
        type: "address",
      },
    ],
    name: "getInsuranceCards",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "cardNumber",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "issuedOn",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "status",
            type: "string",
          },
          {
            internalType: "address",
            name: "insuranceCompany",
            type: "address",
          },
        ],
        internalType: "struct SysGa.InsuranceCard[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
