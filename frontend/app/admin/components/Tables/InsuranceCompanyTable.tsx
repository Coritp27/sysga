import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye, Edit, Trash2, Building2, Phone, Mail, Globe } from "lucide-react";
import { InsuranceCompany } from "../../types/insurance-company";

interface InsuranceCompanyTableProps {
  insuranceCompanies: InsuranceCompany[];
  onEdit: (company: InsuranceCompany) => void;
  onDelete: (id: number) => void;
}

const InsuranceCompanyTable = ({
  insuranceCompanies,
  onEdit,
  onDelete,
}: InsuranceCompanyTableProps) => {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[200px] xl:pl-7.5">Compagnie</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Informations</TableHead>
            <TableHead>Employés</TableHead>
            <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {insuranceCompanies.map((company, index) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell className="min-w-[200px] xl:pl-7.5">
                <div>
                  <h5 className="text-dark dark:text-white font-medium">
                    {company.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {company.taxId}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-dark dark:text-white">
                      {company.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-dark dark:text-white">
                      {company.phone1}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="max-w-[200px]">
                  <p className="text-sm text-dark dark:text-white truncate">
                    {company.address}
                  </p>
                  {company.website && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 truncate"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-dark dark:text-white font-medium">
                      {company.industry}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {company.size}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-dark dark:text-white">
                    {company.numberOfEmployees}
                  </span>
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
                    onClick={() => onEdit(company)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    className="hover:text-red-500"
                    title="Supprimer"
                    onClick={() => company.id && onDelete(company.id)}
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

export default InsuranceCompanyTable;
