"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { contractAddress, contractAbi } from "@/constants";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { Card, CardContent } from "../ui/card";

import Informations from "./Informations";

const CreateCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [issuedOn, setIssuedOn] = useState("");
  const [status, setStatus] = useState("active");
  const [insuranceCompany, setInsuranceCompany] = useState(
    "0x1234567890123456789012345678901234567890"
  );

  const { address } = useAccount();

  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const handleCreateCard = async () => {
    console.log("🚀 Tentative de création de carte:");
    console.log("- cardNumber:", cardNumber);
    console.log("- issuedOn:", issuedOn);
    console.log("- status:", status);
    console.log("- insuranceCompany:", insuranceCompany);
    console.log("- address:", address);
    console.log("- contractAddress:", contractAddress);

    // Convertir la date en timestamp si elle est fournie
    let issuedOnTimestamp = 0;
    if (issuedOn) {
      issuedOnTimestamp = Math.floor(new Date(issuedOn).getTime() / 1000);
      console.log("- issuedOnTimestamp:", issuedOnTimestamp);
    }

    try {
      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "addInsuranceCard",
        args: [cardNumber, issuedOnTimestamp, status, insuranceCompany],
        account: address,
      });
    } catch (err) {
      console.error("❌ Erreur lors de l'appel writeContract:", err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Logs pour les erreurs
  if (error) {
    console.error("❌ Erreur writeContract:", error);
  }

  return (
    <div className="add">
      <div className="add_inner">
        <h1 className="add_inner_title">
          <span className="add_inner_title_colored">
            Créer une carte d'assurance (Test)
          </span>
        </h1>
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
            <div className="add_inner_form_item mt-5">
              <Label htmlFor="insuranceCompany">
                Compagnie d'assurance (Adresse)
              </Label>
              <Input
                type="text"
                id="insuranceCompany"
                placeholder="Ex: 0x1234...abcd"
                value={insuranceCompany}
                onChange={(e) => setInsuranceCompany(e.target.value)}
              />
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
