"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User2,
  Users,
  FileText,
  AlertTriangle,
  Building2,
  Landmark,
  CreditCard,
  Stethoscope,
  Link2,
  FileSearch,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
  category: string;
  status?: string;
  date?: string;
  score: number;
}

interface SearchFilters {
  types: string[];
  status: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

const searchTypes = [
  { value: "insured-persons", label: "Personnes Assurées", Icon: User2 },
  { value: "dependents", label: "Dépendants", Icon: Users },
  { value: "policies", label: "Polices", Icon: FileText },
  { value: "claims", label: "Sinistres", Icon: AlertTriangle },
  { value: "enterprises", label: "Entreprises", Icon: Building2 },
  { value: "insurance-companies", label: "Compagnies d'Assurance", Icon: Landmark },
  { value: "insurance-cards", label: "Cartes d'Assurance", Icon: CreditCard },
  {
    value: "medical-institutions",
    label: "Institutions Médicales",
    Icon: Stethoscope,
  },
  {
    value: "blockchain-references",
    label: "Références Blockchain",
    Icon: Link2,
  },
] as const;

const statusOptions = [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
  "CONFIRMED",
  "FAILED",
  "EXPIRED",
  "CANCELLED",
];

// Mock data for demonstration
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "insured-persons",
    title: "Jean Dupont",
    description: "Personne assurée - Email: jean.dupont@email.com",
    url: "/admin/insured-persons",
    category: "Personnes Assurées",
    status: "ACTIVE",
    date: "2024-01-15",
    score: 0.95,
  },
  {
    id: "2",
    type: "policies",
    title: "POL-2024-001",
    description: "Police d'assurance automobile - Jean Dupont",
    url: "/admin/policies",
    category: "Polices",
    status: "ACTIVE",
    date: "2024-01-20",
    score: 0.88,
  },
  {
    id: "3",
    type: "claims",
    title: "CLM-2024-001",
    description: "Sinistre automobile - En cours d'examen",
    url: "/admin/claims",
    category: "Sinistres",
    status: "IN_REVIEW",
    date: "2024-02-10",
    score: 0.82,
  },
  {
    id: "4",
    type: "enterprises",
    title: "TechCorp Solutions",
    description: "Entreprise technologique - Secteur: Technologie",
    url: "/admin/enterprises",
    category: "Entreprises",
    status: "ACTIVE",
    date: "2024-01-05",
    score: 0.78,
  },
  {
    id: "5",
    type: "insurance-companies",
    title: "AXA Assurance",
    description: "Compagnie d'assurance - Code: AXA001",
    url: "/admin/insurance-companies",
    category: "Compagnies d'Assurance",
    status: "ACTIVE",
    date: "2024-01-01",
    score: 0.75,
  },
  {
    id: "6",
    type: "medical-institutions",
    title: "Hôpital Central de Paris",
    description: "Institution médicale - Type: Hôpital",
    url: "/admin/medical-institutions",
    category: "Institutions Médicales",
    status: "ACTIVE",
    date: "2024-01-10",
    score: 0.72,
  },
  {
    id: "7",
    type: "blockchain-references",
    title: "REF-2024-001",
    description: "Référence blockchain - Transaction Ethereum",
    url: "/admin/blockchain-references",
    category: "Références Blockchain",
    status: "CONFIRMED",
    date: "2024-02-15",
    score: 0.68,
  },
  {
    id: "8",
    type: "dependents",
    title: "Marie Dupont",
    description: "Dépendant - Relation: Enfant",
    url: "/admin/dependents",
    category: "Dépendants",
    status: "ACTIVE",
    date: "2024-01-25",
    score: 0.65,
  },
];

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    status: [],
    dateRange: {
      start: "",
      end: "",
    },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  // Simulate search with delay
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter mock results based on query and filters
    let filteredResults = mockSearchResults.filter((result) => {
      const matchesQuery =
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase());

      const matchesType =
        filters.types.length === 0 || filters.types.includes(result.type);
      const matchesStatus =
        filters.status.length === 0 ||
        (result.status && filters.status.includes(result.status));

      const matchesDateRange =
        (!filters.dateRange.start && !filters.dateRange.end) ||
        (result.date &&
          (!filters.dateRange.start ||
            result.date >= filters.dateRange.start) &&
          (!filters.dateRange.end || result.date <= filters.dateRange.end));

      return matchesQuery && matchesType && matchesStatus && matchesDateRange;
    });

    // Sort by relevance score
    filteredResults.sort((a, b) => b.score - a.score);

    setSearchResults(filteredResults);
    setIsSearching(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
  };

  const handleTypeFilterChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      status: [],
      dateRange: {
        start: "",
        end: "",
      },
    });
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = searchTypes.find((t) => t.value === type);
    const Icon = typeInfo?.Icon || FileSearch;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
      case "CONFIRMED":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
      case "IN_REVIEW":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
      case "INACTIVE":
      case "REJECTED":
      case "FAILED":
      case "CANCELLED":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
      case "SUSPENDED":
      case "EXPIRED":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h1 className="text-title-md2 font-semibold text-black dark:text-white mb-2">
          Recherche Globale
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Recherchez dans toutes les entités du système d'assurance
        </p>
      </div>

      {/* Search Form */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des personnes assurées, polices, sinistres, entreprises..."
              className="w-full px-4 py-3 pl-12 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-strokedark dark:bg-boxdark dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 flex items-center bg-primary text-white rounded-r-lg hover:bg-opacity-90"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Quick Type Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedType === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Tout
          </button>
          {searchTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === type.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <type.Icon className="h-4 w-4 mr-1" />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            />
          </svg>
          Filtres
        </button>

        {searchResults.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""}{" "}
            trouvé{searchResults.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 dark:border-strokedark dark:bg-boxdark">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Types d'entités
              </h3>
              <div className="space-y-2">
                {searchTypes.map((type) => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type.value)}
                      onChange={() => handleTypeFilterChange(type.value)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {type.icon} {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Statuts
              </h3>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleStatusFilterChange(status)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Période
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Du
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value },
                      }))
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Au
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value },
                      }))
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Recherche en cours...
            </span>
          </div>
        )}

        {!isSearching && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun résultat trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Essayez de modifier vos critères de recherche ou vos filtres.
            </p>
          </div>
        )}

        {!isSearching &&
          searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:border-strokedark dark:hover:bg-meta-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </h3>
                      {result.status && (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}
                        >
                          {result.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {result.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{result.category}</span>
                      {result.date && (
                        <span>
                          Créé le{" "}
                          {new Date(result.date).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                      <span>Pertinence: {Math.round(result.score * 100)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Recent Searches */}
      {!searchQuery && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recherches récentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchTypes.slice(0, 6).map((type) => (
              <div
                key={type.value}
                onClick={() => router.push(`/admin/${type.value}`)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:border-strokedark dark:hover:bg-meta-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    <type.Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Voir tous les {type.label.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
