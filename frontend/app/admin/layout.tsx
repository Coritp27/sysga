import React from "react";
import "./css/satoshi.css";
import "./css/style.css";

import { Sidebar } from "./components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "./components/Layouts/header";
import type { Metadata } from "next";
// @ts-ignore
// import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import ClientTopLoader from "./components/ClientTopLoader";
import { Providers } from "./providers";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | SYSGA - Système de Gestion d'Assurance",
    default: "SYSGA - Système de Gestion d'Assurance",
  },
  description:
    "Système de gestion d'assurance moderne avec interface d'administration complète pour la gestion des polices, assurés et compagnies.",
};

export default async function AdminLayout({ children }: PropsWithChildren) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <Providers>
      <ClientTopLoader color="#5750F1" showSpinner={false} />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />
          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
