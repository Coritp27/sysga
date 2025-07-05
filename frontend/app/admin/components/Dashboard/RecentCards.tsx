"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";

interface RecentCard {
  id: string;
  cardNumber: string;
  insuredPerson: string;
  status: "active" | "pending" | "expired";
  blockchainStatus: "confirmed" | "pending" | "failed";
  createdAt: string;
  transactionHash?: string;
}

const statusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "En attente";
    case "expired":
      return "Expirée";
    default:
      return status;
  }
};

const blockchainStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

const blockchainStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmé";
    case "pending":
      return "En attente";
    case "failed":
      return "Échoué";
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RecentCards = () => {
  const [recentCards, setRecentCards] = useState<RecentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentCards = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/recent-cards");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des cartes récentes");
        }
        const data = await response.json();
        setRecentCards(data);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentCards();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Dernières Cartes</h2>
            <p className="text-sm text-muted-foreground">Chargement…</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border">
          <div className="divide-y divide-gray-200">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Dernières Cartes</h2>
            <p className="text-sm text-muted-foreground">
              Cartes d'assurance récemment créées
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dernières Cartes</h2>
          <p className="text-sm text-muted-foreground">
            {recentCards.length} carte{recentCards.length > 1 ? "s" : ""}{" "}
            récemment créée{recentCards.length > 1 ? "s" : ""}
          </p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir toutes →
        </button>
      </div>
      <div className="bg-white rounded-lg border">
        <div className="divide-y divide-gray-200">
          {recentCards.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucune carte récente
            </div>
          ) : (
            recentCards.map((card) => (
              <div key={card.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  {/* Partie gauche : icône, numéro, badge Active */}
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="truncate font-semibold text-gray-900 text-base">
                          {card.cardNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {statusLabel(card.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-0.5">
                        <span className="truncate">{card.insuredPerson}</span>
                        <span>·</span>
                        <span>{formatDate(card.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Partie droite : badge Confirmé + hash */}
                  <div className="flex flex-col items-end space-y-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      {blockchainStatusIcon(card.blockchainStatus)}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          card.blockchainStatus === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : card.blockchainStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {blockchainStatusLabel(card.blockchainStatus)}
                      </span>
                    </div>
                    {card.transactionHash && (
                      <span className="text-xs text-blue-600 font-mono truncate max-w-32">
                        {card.transactionHash.slice(0, 10)}...
                        {card.transactionHash.slice(-8)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentCards;
