export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
