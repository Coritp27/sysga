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
import { PreviewIcon } from "./icons";
import prisma from "@/lib/prismadb";
import { InsuranceCardStatus } from "@prisma/client";
import { TrashIcon } from "lucide-react";

export async function InsuranceCardTable() {
  const insuranceCards = await prisma.insuranceCard.findMany();

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">
              Card Holder
            </TableHead>
            <TableHead>Card Number</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {insuranceCards.map((card, index) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell className="min-w-[155px] xl:pl-7.5">
                <h5 className="text-dark dark:text-white">
                  {card.insuredPersonName}
                </h5>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">{card.cardNumber}</p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">
                  {dayjs(card.policyEffectiveDate).format("MMM DD, YYYY")}
                </p>
              </TableCell>

              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]":
                        card.status === InsuranceCardStatus.ACTIVE,
                      "bg-[#D34053]/[0.08] text-[#D34053]":
                        card.status === InsuranceCardStatus.REVOKED,
                      "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        card.status === InsuranceCardStatus.INACTIVE,
                    }
                  )}
                >
                  {card.status}
                </div>
              </TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary">
                    <span className="sr-only">View Card Details</span>
                    <PreviewIcon />
                  </button>

                  <button className="hover:text-primary">
                    <span className="sr-only">Deactivate Card</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
