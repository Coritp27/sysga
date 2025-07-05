"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const WalletConnectionModal = ({
  isOpen,
  onClose,
  title = "Connexion Wallet Requise",
  message = "Connectez votre wallet pour effectuer cette action sur la blockchain",
}: WalletConnectionModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSettingsRedirect = () => {
    router.push("/admin/settings");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">{message}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">i</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  Pourquoi connecter un wallet ?
                </p>
                <p className="text-xs">
                  La blockchain garantit la sécurité et l'immutabilité de vos
                  cartes d'assurance. Chaque création/modification nécessite une
                  signature de votre wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-4">
          <div className="flex justify-center">
            <ConnectButton showBalance={false} />
          </div>
        </div>

        {/* Alternative Options */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 mb-3 text-center">
            Ou configurez votre wallet dans les paramètres
          </p>
          <button
            onClick={handleSettingsRedirect}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Aller aux paramètres</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionModal;
