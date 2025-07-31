"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { contractAddress, contractAbi } from "@/constants";
import { useWorkspace } from "@/hooks/useWorkspace";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { Card, CardContent } from "../ui/card";

import Informations from "./Informations";

const CreateCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [issuedOn, setIssuedOn] = useState("");
  const [status, setStatus] = useState("active");

  const { address } = useAccount();
  const { user, isLoading: userLoading } = useWorkspace();

  const { data: hash, isPending, error, writeContract } = useWriteContract();

  // Récupérer l'adresse de la compagnie d'assurance
  const insuranceCompanyAddress = user?.insuranceCompany?.blockchainAddress;

  const handleCreateCard = async () => {
    console.log("🚀 Tentative de création de carte:");
    console.log("- cardNumber:", cardNumber);
    console.log("- issuedOn:", issuedOn);
    console.log("- status:", status);
    console.log("- user:", user);
    console.log("- insuranceCompanyAddress:", insuranceCompanyAddress);
    console.log("- address:", address);
    console.log("- contractAddress:", contractAddress);

    if (!insuranceCompanyAddress) {
      console.error("❌ Aucune adresse de compagnie d'assurance trouvée");
      alert(
        "Erreur: Aucune adresse de compagnie d'assurance configurée. Veuillez contacter l'administrateur."
      );
      return;
    }

    // Convertir la date en timestamp si elle est fournie
    let issuedOnTimestamp = 0;
    if (issuedOn) {
      issuedOnTimestamp = Math.floor(new Date(issuedOn).getTime() / 1000);
      console.log("- issuedOnTimestamp:", issuedOnTimestamp);
    }

    try {
      console.log("📡 Envoi de la transaction...");

      // Ajouter un timeout pour éviter les blocages
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(new Error("Timeout: La transaction a pris trop de temps")),
          120000
        ); // 2 minutes
      });

      const contractPromise = writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "addInsuranceCard",
        args: [cardNumber, issuedOnTimestamp, status, insuranceCompanyAddress],
        account: address,
        gas: 300000, // Limite de gas explicite
      });

      // Race entre le timeout et la transaction
      await Promise.race([contractPromise, timeoutPromise]);

      console.log("✅ Transaction envoyée avec succès");
    } catch (err) {
      console.error("❌ Erreur lors de l'appel writeContract:", err);

      // Gestion spécifique des erreurs de timeout
      if (err.message.includes("Timeout")) {
        alert(
          "Erreur: La transaction a pris trop de temps. Veuillez réessayer ou vérifier votre connexion réseau."
        );
      } else if (err.message.includes("insufficient funds")) {
        alert(
          "Erreur: Fonds insuffisants pour payer les frais de transaction."
        );
      } else if (err.message.includes("user rejected")) {
        alert("Transaction annulée par l'utilisateur.");
      } else {
        alert(`Erreur lors de la création de la carte: ${err.message}`);
      }
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Logs pour les erreurs
  if (error) {
    console.error("❌ Erreur writeContract:", error);
  }

  // Afficher un message si l'utilisateur n'a pas de compagnie d'assurance
  if (userLoading) {
    return (
      <div className="add">
        <div className="add_inner">
          <h1 className="add_inner_title">
            <span className="add_inner_title_colored">Chargement...</span>
          </h1>
        </div>
      </div>
    );
  }

  if (!user?.insuranceCompany?.blockchainAddress) {
    return (
      <div className="add">
        <div className="add_inner">
          <h1 className="add_inner_title">
            <span className="add_inner_title_colored">
              Configuration requise
            </span>
          </h1>
          <Card>
            <CardContent className="pt-5">
              <p className="text-red-600 mb-4">
                Votre compte n'est pas associé à une compagnie d'assurance avec
                une adresse blockchain configurée.
              </p>
              <p className="text-gray-600">
                Veuillez contacter l'administrateur pour configurer l'adresse
                blockchain de votre compagnie d'assurance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="add">
      <div className="add_inner">
        <h1 className="add_inner_title">
          <span className="add_inner_title_colored">
            Créer une carte d'assurance
          </span>
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Compagnie: {user.insuranceCompany.name} ({insuranceCompanyAddress})
        </p>
        <Informations
          hash={hash}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          error={error}
        />
        <Card>
          <CardContent className="pt-5">
            <div className="add_inner_form_item">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                type="text"
                id="cardNumber"
                placeholder="Ex: CARD-2024-001"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="add_inner_form_item mt-5">
              <Label htmlFor="issuedOn">Date d'émission</Label>
              <Input
                type="date"
                id="issuedOn"
                value={issuedOn}
                onChange={(e) => setIssuedOn(e.target.value)}
              />
            </div>
            <div className="add_inner_form_item mt-5">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expirée</option>
                <option value="suspended">Suspendue</option>
              </select>
            </div>
            <Button
              variant="outline"
              disabled={isPending}
              className="add_inner_submit_button hover:bg-[#4caf50]"
              onClick={handleCreateCard}
            >
              {isPending ? "Création..." : "Créer une carte d'assurance"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCard;
