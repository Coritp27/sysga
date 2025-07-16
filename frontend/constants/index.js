export const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

export const networkConfig = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR-PROJECT-ID",
    explorer: "https://sepolia.etherscan.io",
  },
  polygonMumbai: {
    chainId: 80001,
    name: "Polygon Mumbai",
    rpcUrl: "https://polygon-mumbai.infura.io/v3/YOUR-PROJECT-ID",
    explorer: "https://mumbai.polygonscan.com",
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
