"use client";

import React from "react";
import { useAccount } from "wagmi";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";

const WalletStatus = () => {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Wallet non connecté
            </p>
            <p className="text-xs text-yellow-600">
              Connectez votre wallet pour créer des cartes d'assurance
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-green-800">Wallet connecté</p>
          <p className="text-xs text-green-600 font-mono">
            {address?.substring(0, 10)}...
            {address?.substring(address.length - 8)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
