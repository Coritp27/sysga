import React from "react";

interface AuthenticationInfoProps {
  user: any;
}

export const AuthenticationInfo = ({ user }: AuthenticationInfoProps) => {
  return (
    <div className="mb-6 rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/20">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="h-4 w-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Système d'authentification hybride
          </h3>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                <strong>Authentification Clerk :</strong> Accès au système et
                séparation des données par compagnie
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                <strong>Wallet Blockchain :</strong> Nécessaire pour
                créer/modifier des cartes d'assurance
              </span>
            </div>
            {user?.insuranceCompany && (
              <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-200">
                <strong>Compagnie actuelle :</strong>{" "}
                {user.insuranceCompany.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
