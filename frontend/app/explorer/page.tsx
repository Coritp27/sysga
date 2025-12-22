"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  CreditCard,
  Shield,
  AlertTriangle,
  Phone,
  Lock,
} from "lucide-react";
import { useContractRead } from "wagmi";
import { contractAbi } from "../../constants";
import Header from "@/components/shared/Header";
import { usePathname } from "next/navigation";

interface DatabaseCard {
  id: number;
  cardNumber: string;
  insuredPersonName: string;
  policyNumber: number;
  dateOfBirth: string;
  policyEffectiveDate: string;
  validUntil: string;
  status: string;
  hadDependent: boolean;
  numberOfDependent: number;
  insuredPerson: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    cin: string;
    nif: string;
  };
  insuranceCompany: {
    id: number;
    name: string;
  };
  blockchainReference: {
    id: number;
    reference: number;
    blockchainTxHash: string;
    createdAt: string;
  } | null;
}

interface BlockchainCard {
  id: number;
  cardNumber: string;
  issuedOn: number;
  status: string;
  insuranceCompany: string;
}

type VerificationStep = "search" | "contact" | "otp" | "result";

export default function BlockchainExplorerPage() {
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState<VerificationStep>("search");
  const [searchValue, setSearchValue] = useState("");
  const [contactMethod, setContactMethod] = useState<"phone" | "email">(
    "phone"
  );
  const [contactValue, setContactValue] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [searchResult, setSearchResult] = useState<DatabaseCard | null>(null);
  const [blockchainData, setBlockchainData] = useState<BlockchainCard | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "mismatch" | "not-found"
  >("pending");
  const [isClient, setIsClient] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);

  // Éviter l'hydratation avec des données qui changent
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lecture des données blockchain
  const { data: blockchainCards } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: contractAbi,
    functionName: "getInsuranceCards",
    args: [process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`],
  });

  // Recherche de carte (étape 1)
  const searchCard = async () => {
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);
    setBlockchainData(null);
    setVerificationStatus("pending");

    try {
      const params = new URLSearchParams();
      params.append("search", searchValue);
      params.append("all", "true");

      const response = await fetch(`/api/insurance-cards?${params.toString()}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur HTTP:", response.status, errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const results = await response.json();

      if (results.length > 0) {
        const dbCard = results[0];
        setSearchResult(dbCard);
        setCurrentStep("contact"); // Passer à l'étape de contact
      } else {
        setSearchError("Aucune carte trouvée");
      }
    } catch (error) {
      setSearchError("Erreur lors de la recherche");
      console.error("Erreur de recherche:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Envoi du code OTP (étape 2)
  const sendOTP = async () => {
    if (!contactValue.trim() || !searchResult) return;

    setIsSendingOTP(true);
    setOtpError("");

    try {
      const response = await fetch("/api/otp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: searchResult.cardNumber,
          phoneNumber: contactMethod === "phone" ? contactValue : undefined,
          email: contactMethod === "email" ? contactValue : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setOtpExpiresIn(result.expiresIn);
        setCurrentStep("otp");

        // Démarrer le countdown
        const interval = setInterval(() => {
          setOtpExpiresIn((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setOtpError(result.error || "Erreur lors de l'envoi du code OTP");
      }
    } catch (error) {
      setOtpError("Erreur lors de l'envoi du code OTP");
      console.error("Erreur OTP:", error);
    } finally {
      setIsSendingOTP(false);
    }
  };

  // Vérification du code OTP (étape 3)
  const verifyOTP = async () => {
    if (!otpCode.trim() || !searchResult) return;

    setIsVerifyingOTP(true);
    setOtpError("");

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: searchResult.cardNumber,
          otpCode: otpCode,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const dbCard = result.data;
        setSearchResult(dbCard);

        // Vérifier les données blockchain
        if (dbCard.blockchainReference && blockchainCards) {
          const blockchainCard = (blockchainCards as any[]).find(
            (card: any) =>
              card.id.toString() ===
              dbCard.blockchainReference?.reference.toString()
          );

          if (blockchainCard) {
            setBlockchainData({
              id: Number(blockchainCard.id),
              cardNumber: blockchainCard.cardNumber,
              issuedOn: Number(blockchainCard.issuedOn),
              status: blockchainCard.status,
              insuranceCompany: blockchainCard.insuranceCompany,
            });

            // Vérifier la cohérence
            const isCardNumberMatch =
              blockchainCard.cardNumber === dbCard.cardNumber;
            const isStatusMatch =
              blockchainCard.status.toLowerCase() ===
              dbCard.status.toLowerCase();

            if (isCardNumberMatch && isStatusMatch) {
              setVerificationStatus("verified");
            } else {
              setVerificationStatus("mismatch");
            }
          } else {
            setVerificationStatus("not-found");
          }
        } else {
          setVerificationStatus("not-found");
        }

        setCurrentStep("result");
      } else {
        setOtpError(result.error || "Code OTP invalide");
      }
    } catch (error) {
      setOtpError("Erreur lors de la vérification du code OTP");
      console.error("Erreur vérification OTP:", error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "inactive":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "revoked":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Carte Valide";
      case "inactive":
        return "Carte Inactive";
      case "revoked":
        return "Carte Révoquée";
      default:
        return "Statut Inconnu";
    }
  };

  const getVerificationIcon = () => {
    switch (verificationStatus) {
      case "verified":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "mismatch":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "not-found":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getVerificationText = () => {
    switch (verificationStatus) {
      case "verified":
        return "Vérification blockchain réussie";
      case "mismatch":
        return "Données incohérentes";
      case "not-found":
        return "Non trouvé sur la blockchain";
      default:
        return "Vérification en cours...";
    }
  };

  const formatDate = (dateString: string) => {
    // Éviter l'hydratation avec des dates qui changent
    if (!isClient) return "";

    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Forcer UTC pour la cohérence
    });
  };

  const formatBlockchainDate = (timestamp: number) => {
    // Utiliser UTC pour éviter les problèmes de fuseau horaire
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Forcer UTC pour la cohérence
    });
  };

  // Réinitialiser le flow
  const resetFlow = () => {
    setCurrentStep("search");
    setSearchValue("");
    setContactValue("");
    setOtpCode("");
    setSearchResult(null);
    setBlockchainData(null);
    setSearchError("");
    setOtpError("");
    setVerificationStatus("pending");
    setOtpExpiresIn(0);
  };

  const isStandalone = pathname === "/explorer";

  // Éviter l'hydratation complète si pas côté client
  if (!isClient) {
    return (
      <div className={isStandalone ? "min-h-screen bg-gray-50" : ""}>
        {isStandalone && <Header />}
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Vérification Carte d'Assurance
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Entrez le numéro de carte, CIN ou nom pour vérifier la validité
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Numéro de carte, CIN ou nom..."
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  disabled
                  className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Vérifier
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comment vérifier une carte d'assurance ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <p className="text-gray-600">
                  Entrez le numéro de carte, CIN ou nom
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <p className="text-gray-600">Cliquez sur "Vérifier"</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <p className="text-gray-600">Consultez le résultat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isStandalone ? "min-h-screen bg-gray-50" : ""}>
      {isStandalone && <Header />}
      <div className="max-w-4xl mx-auto p-6">
        {/* En-tête simple */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Vérification Carte d'Assurance
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Entrez le numéro de carte, CIN ou nom pour vérifier la validité
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              {(
                [
                  { step: "search", label: "Recherche", Icon: Search },
                  { step: "contact", label: "Contact", Icon: Phone },
                  { step: "otp", label: "Vérification", Icon: Lock },
                  { step: "result", label: "Résultat", Icon: CheckCircle },
                ] as const
              ).map((item, index) => (
                <div key={item.step} className="flex items-center">
                  {/* Cercle d'étape avec icône */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                      currentStep === item.step
                        ? "bg-primary text-white"
                        : ["search", "contact", "otp", "result"].indexOf(
                              currentStep
                            ) > index
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {["search", "contact", "otp", "result"].indexOf(
                      currentStep
                    ) > index ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <item.Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep === item.step
                        ? "text-primary"
                        : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                  {index < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-4 ${
                        ["search", "contact", "otp", "result"].indexOf(
                          currentStep
                        ) > index
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Étape 1: Recherche */}
        {currentStep === "search" && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Rechercher une carte d'assurance
              </h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Numéro de carte, CIN ou nom..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchCard()}
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={searchCard}
                  disabled={!searchValue.trim() || isSearching}
                  className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Rechercher
                    </>
                  )}
                </button>
              </div>
              {searchError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-center">{searchError}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Étape 2: Contact */}
        {currentStep === "contact" && searchResult && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Vérification d'identité
              </h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-primary text-center">
                  Carte trouvée pour{" "}
                  <strong>
                    {searchResult.insuredPerson.firstName}{" "}
                    {searchResult.insuredPerson.lastName}
                  </strong>
                </p>
                <p className="text-primary text-sm text-center mt-1">
                  Carte: {searchResult.cardNumber}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de vérification
                  </label>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => setContactMethod("phone")}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium ${
                        contactMethod === "phone"
                          ? "border-primary bg-blue-50 text-primary"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <Phone className="inline-block h-4 w-4 mr-1" />
                      SMS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contactMethod === "phone"
                      ? "Numéro de téléphone"
                      : "Adresse email"}
                  </label>
                  <input
                    type={contactMethod === "phone" ? "tel" : "email"}
                    placeholder={
                      contactMethod === "phone"
                        ? "+33123456789"
                        : "exemple@email.com"
                    }
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendOTP()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  onClick={sendOTP}
                  disabled={!contactValue.trim() || isSendingOTP}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                >
                  {isSendingOTP ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Envoyer le code de vérification
                    </>
                  )}
                </button>
              </div>

              {otpError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-center">{otpError}</p>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep("search")}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Retour à la recherche
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Vérification OTP */}
        {currentStep === "otp" && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Code de vérification
              </h2>
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 text-center">
                  Code envoyé par {contactMethod === "phone" ? "SMS" : "email"}
                </p>
                <p className="text-green-600 text-sm text-center mt-1">
                  {contactMethod === "phone" ? "au" : "à"} {contactValue}
                </p>
                {otpExpiresIn > 0 && (
                  <p className="text-orange-600 text-sm text-center mt-1">
                    ⏰ Expire dans {Math.floor(otpExpiresIn / 60)}:
                    {(otpExpiresIn % 60).toString().padStart(2, "0")}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code de vérification (6 chiffres)
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    onKeyPress={(e) => e.key === "Enter" && verifyOTP()}
                    className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={verifyOTP}
                  disabled={
                    otpCode.length !== 6 || isVerifyingOTP || otpExpiresIn === 0
                  }
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                >
                  {isVerifyingOTP ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Vérification...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Vérifier le code
                    </>
                  )}
                </button>

                {otpExpiresIn === 0 && (
                  <div className="text-center">
                    <p className="text-red-600 mb-2">Code expiré</p>
                    <button
                      onClick={sendOTP}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Renvoyer un nouveau code
                    </button>
                  </div>
                )}
              </div>

              {otpError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-center">{otpError}</p>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep("contact")}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Retour au contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Étape 4: Résultat (e-carte) */}
        {currentStep === "result" && searchResult && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-6">
                {/* E-card visual (kept) */}
                <div className="w-full bg-gradient-to-r from-white to-blue-50 border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Assuré</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {searchResult.insuredPerson.firstName} {" "}
                          {searchResult.insuredPerson.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {searchResult.insuranceCompany.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border">
                          {getStatusIcon(searchResult.status)}
                          <span className="ml-2 text-sm font-medium">
                            {getStatusText(searchResult.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <p className="text-xs text-gray-500">Carte</p>
                        <p className="font-medium">{searchResult.cardNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Police</p>
                        <p className="font-medium">#{searchResult.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">CIN</p>
                        <p className="font-medium">{searchResult.insuredPerson.cin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">NIF</p>
                        <p className="font-medium">{searchResult.insuredPerson.nif}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button (kept) */}
                <div className="w-full max-w-xs">
                  <button
                    onClick={resetFlow}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium"
                  >
                    Nouvelle recherche
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions simples */}
        {currentStep === "search" && !isSearching && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comment vérifier une carte d'assurance ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <p className="text-gray-600">
                  Entrez le numéro de carte, CIN ou nom
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <p className="text-gray-600">Cliquez sur "Vérifier"</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <p className="text-gray-600">Consultez le résultat</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
