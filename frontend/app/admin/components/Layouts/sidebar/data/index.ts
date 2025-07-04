import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "GESTION D'ASSURANCE",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Dashboard",
            url: "/admin/dashboard",
          },
        ],
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
        items: [
          {
            title: "Liste des Cartes",
            url: "/admin/insurance-cards",
          },
        ],
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
    label: "BLOCKCHAIN",
    items: [
      {
        title: "Références",
        url: "/admin/blockchain-references",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Liste des Références",
            url: "/admin/blockchain-references",
          },
        ],
      },
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
        title: "Paramètres",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Paramètres",
            url: "/admin/settings",
          },
        ],
      },
      {
        title: "Rapports",
        icon: Icons.PieChart,
        items: [
          {
            title: "Rapports",
            url: "/admin/reports",
          },
        ],
      },
    ],
  },
];
