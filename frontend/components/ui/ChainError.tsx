"use client";

import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface ChainErrorProps {
  children: React.ReactNode;
}

export function ChainError({ children }: ChainErrorProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Vérifier si la chaîne est supportée (Sepolia = 11155111)
  const isChainSupported = chainId === 11155111;

  // Si l'utilisateur n'est pas connecté, afficher le bouton de connexion
  if (!isConnected) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connexion Requise
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Veuillez vous connecter avec votre wallet pour accéder aux
              fonctionnalités blockchain.
            </p>
          </div>
          <ConnectButton />
        </div>
      </div>
    );
  }

  // Si la chaîne n'est pas supportée, afficher un message d'erreur
  if (!isChainSupported) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Réseau Non Supporté
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Vous êtes connecté au réseau {chainId}. Veuillez basculer vers le
              réseau Sepolia pour utiliser l'application.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Comment basculer vers Sepolia :
              </h3>
              <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>1. Ouvrez votre wallet (MetaMask)</li>
                <li>2. Cliquez sur le réseau actuel</li>
                <li>3. Sélectionnez "Sepolia" dans la liste</li>
                <li>4. Confirmez le changement de réseau</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si tout est correct, afficher le contenu
  return <>{children}</>;
}
