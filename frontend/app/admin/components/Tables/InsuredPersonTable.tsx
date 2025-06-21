import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../../lib/utils";
import dayjs from "dayjs";
import { Eye, Edit, Trash2 } from "lucide-react";

const InsuredPersonTable = () => {
  // TODO: Récupérer les vraies données depuis la base de données
  const insuredPersons = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("1990-01-01"),
      email: "john.doe@email.com",
      cin: "CIN123456",
      nif: "NIF654321",
      hasDependent: true,
      numberOfDependent: 2,
      enterprise: { name: "Entreprise Test" },
      insuranceCards: [{ status: "ACTIVE" }, { status: "ACTIVE" }],
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Dupont",
      dateOfBirth: new Date("1985-05-15"),
      email: "marie.dupont@email.com",
      cin: "CIN789012",
      nif: "NIF210987",
      hasDependent: false,
      numberOfDependent: 0,
      enterprise: null,
      insuranceCards: [{ status: "ACTIVE" }],
    },
  ];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[200px] xl:pl-7.5">
              Nom Complet
            </TableHead>
            <TableHead>CIN</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Dépendants</TableHead>
            <TableHead>Cartes</TableHead>
            <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {insuredPersons.map((person, index) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell className="min-w-[200px] xl:pl-7.5">
                <div>
                  <h5 className="text-dark dark:text-white font-medium">
                    {person.firstName} {person.lastName}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {dayjs(person.dateOfBirth).format("DD/MM/YYYY")}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white font-mono text-sm">
                  {person.cin}
                </p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">{person.email}</p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">
                  {person.enterprise?.name || "Aucune"}
                </p>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-dark dark:text-white">
                    {person.numberOfDependent}
                  </span>
                  {person.hasDependent && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Oui
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-dark dark:text-white">
                    {person.insuranceCards.length}
                  </span>
                  <div className="flex space-x-1">
                    {person.insuranceCards
                      .slice(0, 3)
                      .map((card, cardIndex) => (
                        <div
                          key={cardIndex}
                          className={cn("w-2 h-2 rounded-full", {
                            "bg-green-500": card.status === "ACTIVE",
                            "bg-yellow-500": card.status === "INACTIVE",
                            "bg-red-500": card.status === "REVOKED",
                          })}
                        />
                      ))}
                    {person.insuranceCards.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{person.insuranceCards.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button
                    className="hover:text-primary"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button className="hover:text-primary" title="Modifier">
                    <Edit className="h-4 w-4" />
                  </button>

                  <button className="hover:text-red-500" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InsuredPersonTable;
