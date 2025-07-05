"use client";

import React from "react";
import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useBlockchainData } from "../../../../hooks/useBlockchainData";

const BlockchainStatus = () => {
  const {
    blockchainData: blockchainInfo,
    loading,
    error,
    isConnected,
  } = useBlockchainData();

  const getStatusIcon = () => {
    if (!blockchainInfo)
      return <CheckCircle className="h-5 w-5 text-green-500" />;

    return blockchainInfo.status === "Connected" ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = () => {
    if (!blockchainInfo) return "text-green-600";

    return blockchainInfo.status === "Connected"
      ? "text-green-600"
      : "text-red-600";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">État Blockchain</h2>
          <p className="text-sm text-muted-foreground">
            Informations sur la connexion blockchain
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">État Blockchain</h2>
          <p className="text-sm text-muted-foreground">
            Informations sur la connexion blockchain
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blockchainInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">État Blockchain</h2>
        <p className="text-sm text-muted-foreground">
          Informations sur la connexion blockchain
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Statut de connexion */}
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Statut</p>
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {blockchainInfo.status}
                </span>
              </div>
            </div>
          </div>

          {/* Réseau */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">E</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Réseau</p>
              <p className="text-sm text-gray-600">{blockchainInfo.network}</p>
            </div>
          </div>

          {/* Dernier bloc */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-sm font-bold text-green-600">#</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dernier bloc</p>
              <p className="text-sm text-gray-600">
                {blockchainInfo.lastBlock}
              </p>
            </div>
          </div>

          {/* Transactions en attente */}
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">En attente</p>
              <p className="text-sm text-gray-600">
                {blockchainInfo.pendingTransactions} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Prix du gas:</span>
                <span className="text-sm font-medium text-gray-900">
                  {blockchainInfo.gasPrice}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Taux de confirmation:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {blockchainInfo.confirmationRate}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Total transactions:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {blockchainInfo.totalTransactions.toLocaleString()}
                </span>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Voir les détails →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStatus;
