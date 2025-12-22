"use client";

import React from "react";
import { Shield, Database, Lock, CheckCircle } from "lucide-react";

const BlockchainInfo = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Système Hybride : Base de Données + Blockchain
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            VeriCarte combine une base de données traditionnelle pour la
            gestion quotidienne et la blockchain pour la sécurité et
            l'immutabilité des cartes d'assurance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700">Gestion quotidienne</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-700">Sécurité blockchain</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">
                Traçabilité complète
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainInfo;
