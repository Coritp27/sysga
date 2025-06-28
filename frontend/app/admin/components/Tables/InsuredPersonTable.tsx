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
import { Eye, Edit, Trash2, Users, User } from "lucide-react";
import { InsuredPerson } from "../../../../hooks/useInsuredPersons";

interface InsuredPersonTableProps {
  insuredPersons: InsuredPerson[];
  loading?: boolean;
  searchTerm?: string;
  onEdit?: (person: InsuredPerson) => void;
  onDelete?: (person: InsuredPerson) => void;
}

const InsuredPersonTable = ({
  insuredPersons,
  loading = false,
  searchTerm = "",
  onEdit,
  onDelete,
}: InsuredPersonTableProps) => {
  // Filtrer les personnes selon le terme de recherche
  const filteredPersons = insuredPersons.filter((person) => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    const email = person.email.toLowerCase();
    const cin = person.cin.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      cin.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Chargement...</span>
        </div>
      </div>
    );
  }

  if (filteredPersons.length === 0) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              {searchTerm
                ? "Aucun assuré trouvé pour cette recherche"
                : "Aucun assuré trouvé"}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          {filteredPersons.map((person) => (
            <TableRow
              key={person.id}
              className="border-[#eee] dark:border-dark-3"
            >
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
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-dark dark:text-white font-medium">
                      {person.numberOfDependent || 0} dépendant(s)
                    </span>
                  </div>

                  {person.hasDependent &&
                    person.dependents &&
                    person.dependents.length > 0 && (
                      <div className="space-y-1">
                        {person.dependents
                          .slice(0, 2)
                          .map((dependent, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-xs"
                            >
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-dark dark:text-white">
                                Dépendant #{dependent.id}
                              </span>
                              <span className="text-muted-foreground">
                                ({dependent.relation})
                              </span>
                            </div>
                          ))}
                        {person.dependents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{person.dependents.length - 2} autre(s)
                          </div>
                        )}
                      </div>
                    )}

                  {!person.hasDependent && (
                    <div className="text-xs text-muted-foreground">
                      Aucun dépendant
                    </div>
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

                  <button
                    className="hover:text-primary"
                    title="Modifier"
                    onClick={() => onEdit?.(person)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    className="hover:text-red-500"
                    title="Supprimer"
                    onClick={() => onDelete?.(person)}
                  >
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
