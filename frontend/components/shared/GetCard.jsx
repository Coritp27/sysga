"use client";
import { useState, useEffect } from "react";
import { useReadContract, useWaitForTransactionReceipt } from "wagmi";

import { contractAddress, contractAbi } from "@/constants";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { Card, CardContent } from "../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Informations from "./Informations";

const GetCard = () => {
  const [friendAddress, setFriendAddress] = useState("");
  const [enable, setEnable] = useState(false);

  const { data: userCards, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getInsuranceCards",
    args: [friendAddress],
    query: {
      enabled: enable,
    },
  });

  const handleGetCard = async () => {
    setEnable(true);
  };

  const { data: hash, error } = useWaitForTransactionReceipt();

  useEffect(() => {
    refetch();
  }, [hash]);

  return (
    <div className="get">
      <div className="get_inner">
        <h1 className="get_inner_title">
          <span className="get_inner_title_colored">
            Voir la carte d'assurance
          </span>
        </h1>
        <Card>
          <CardContent className="pt-5">
            <div className="get_inner_form_item">
              <Label htmlFor="friendAddress">Addresse de l'assuré :</Label>
              <Input
                type="text"
                id="friendAddress"
                placeholder="Ex: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                onChange={(e) => setFriendAddress(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="get_inner_submit_button hover:bg-[#4caf50]"
              onClick={handleGetCard}
            >
              Voir la carte d'assurance
            </Button>
          </CardContent>
        </Card>
        <Informations hash={hash} error={error} />
        {userCards && (
          <Card className="mt-5">
            <CardContent className="pt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Numéro de carte</TableHead>
                    <TableHead>Date d'émission</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Compagnie d'assurance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userCards.map((item) => {
                    return (
                      <TableRow key={item.id.toString()}>
                        <TableCell className="font-medium">
                          {item.id.toString()}
                        </TableCell>
                        <TableCell>{item.cardNumber}</TableCell>
                        <TableCell>
                          {new Date(item.issuedOn * 1000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{item.insuranceCompany}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GetCard;
