import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Link href={href}>
    <div
      className={`
      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
      ${
        isActive
          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }
    `}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
  </Link>
);

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/admin/insurance-cards",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Cartes d'Assurance",
    },
    {
      href: "/admin/insured-persons",
      icon: <Users className="h-5 w-5" />,
      label: "Personnes Assurées",
    },
    {
      href: "/admin/insurance-companies",
      icon: <Building2 className="h-5 w-5" />,
      label: "Compagnies Assurance",
    },
    {
      href: "/admin/policies",
      icon: <FileText className="h-5 w-5" />,
      label: "Polices",
    },
    {
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Rapports",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Paramètres",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">VeriCarte</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
