import * as Icons from "../icons";

export const NAV_DATA = [
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
    ],
  },
];
