import * as Icons from "../icons";
import type { ComponentType } from "react";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: ComponentType<any>;
  items: NavSubItem[];
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    items: [
      {
        title: "Tableau de bord",
        url: "/admin/dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Gestion des Assurés",
        url: "/admin/insured-persons",
        icon: Icons.User,
        items: [
          {
            title: "Entreprises",
            url: "/admin/enterprises",
          },
          {
            title: "Polices",
            url: "/admin/policies",
          },
          {
            title: "Assurés",
            url: "/admin/insured-persons",
          },
        ],
      },
      {
        title: "Cartes d'Assurance",
        url: "/admin/insurance-cards",
        icon: Icons.Table,
        items: [],
      },
      // {
      //   title: "Réclamations",
      //   url: "/admin/claims",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Liste des Réclamations",
      //       url: "/admin/claims",
      //     },
      //   ],
      // },
    ],
  },
  {
    label: "SYSTÈME",
    items: [
      {
        title: "Profil",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Vérification des cartes",
        url: "/admin/explorer",
        icon: Icons.Authentication,
        items: [],
      },
      {
        title: "Paramètres",
        url: "/admin/settings",
        icon: Icons.Settings,
        items: [],
      },
    ],
  },
];
