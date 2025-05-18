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
  const [cardNumber] = useState("");
  const [issuedOn, setIssuedOn] = useState("");
  const [status, setStatus] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");

  const { address } = useAccount();

  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const handleCreateCard = async () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "addInsuranceCard",
      args: [cardNumber, issuedOn, status, insuranceCompany],
      account: address,
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  return (
    <div className="add">
      <div className="add_inner">
        <h1 className="add_inner_title">
          <span className="add_inner_title_colored">
            Créer une carte d'assurance
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
                placeholder="Ex: 1234567890123456"
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="add_inner_form_item mt-5">
              <Label htmlFor="issuedOn">Date d'émission</Label>
              <Input
                type="text"
                id="issuedOn"
                placeholder="Ex: 17/05/2025"
                onChange={(e) => setIssuedOn(e.target.value)}
              />
            </div>
            <div className="add_inner_form_item mt-5">
              <Label htmlFor="status">Statut</Label>
              <Input
                type="text"
                id="status"
                placeholder="Ex: Active"
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="add_inner_form_item mt-5">
              <Label htmlFor="insuranceCompany">Compagnie d'assurance</Label>
              <Input
                type="text"
                id="insuranceCompany"
                placeholder="Ex: 0x1234...abcd"
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
