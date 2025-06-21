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
        title: "Cartes d'Assurance",
        url: "/admin/insurance-cards",
        icon: Icons.Table,
        items: [
          {
            title: "Liste des Cartes",
            url: "/admin/insurance-cards",
          },
          {
            title: "Nouvelle Carte",
            url: "/admin/insurance-cards/new",
          },
        ],
      },
      {
        title: "Assurés",
        url: "/admin/insured-persons",
        icon: Icons.User,
        items: [
          {
            title: "Liste des Personnes",
            url: "/admin/insured-persons",
          },
          {
            title: "Nouvelle Personne",
            url: "/admin/insured-persons/new",
          },
        ],
      },
      {
        title: "Dépendants",
        url: "/admin/dependents",
        icon: Icons.User,
        items: [
          {
            title: "Liste des Dépendants",
            url: "/admin/dependents",
          },
          {
            title: "Nouveau Dépendant",
            url: "/admin/dependents/new",
          },
        ],
      },
      {
        title: "Compagnies",
        url: "/admin/insurance-companies",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Liste des Compagnies",
            url: "/admin/insurance-companies",
          },
          {
            title: "Nouvelle Compagnie",
            url: "/admin/insurance-companies/new",
          },
        ],
      },
      {
        title: "Polices",
        url: "/admin/policies",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Liste des Polices",
            url: "/admin/policies",
          },
          {
            title: "Nouvelle Police",
            url: "/admin/policies/new",
          },
        ],
      },
      {
        title: "Entreprises",
        url: "/admin/enterprises",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Liste des Entreprises",
            url: "/admin/enterprises",
          },
          {
            title: "Nouvelle Entreprise",
            url: "/admin/enterprises/new",
          },
        ],
      },
      {
        title: "Institutions",
        url: "/admin/medical-institutions",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Liste des Institutions",
            url: "/admin/medical-institutions",
          },
          {
            title: "Nouvelle Institution",
            url: "/admin/medical-institutions/new",
          },
        ],
      },
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
          {
            title: "Nouvelle Référence",
            url: "/admin/blockchain-references/new",
          },
        ],
      },
    ],
  },
  {
    label: "SYSTÈME",
    items: [
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
        title: "Profil",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
