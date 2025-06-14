import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Dashboard",
            url: "/admin",
          },
        ],
      },
      {
        title: "Insurance cards",
        url: "/admin/insurance-cards",
        icon: Icons.Table,
        items: [
          {
            title: "Insurance cards",
            url: "/admin/insurance-cards",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/admin/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Form Elements",
            url: "/admin/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/admin/forms/form-layout",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/admin/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/admin/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/admin/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/admin/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/admin/auth/sign-in",
          },
        ],
      },
    ],
  },
];
