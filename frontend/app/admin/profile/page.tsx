"use client";

import React from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { useUser } from "@clerk/nextjs";
import {
  User,
  Building2,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";

export default function Page() {
  useUser();
  const { profile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Profil" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Profil" />
        <div className="text-center py-8">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Profil" />
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun profil trouvé</p>
        </div>
      </div>
    );
  }

  const fullName = profile.insuredPerson
    ? `${profile.insuredPerson.firstName} ${profile.insuredPerson.lastName}`
    : profile.username;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Profil" />

      <div className="space-y-6">
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
              <p className="text-gray-600">
                {profile.role?.name || "Utilisateur"}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {profile.isActive ? "Actif" : "Inactif"}
                </span>
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  {profile.userType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        {profile.insuredPerson && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{profile.insuredPerson.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="text-gray-900">{profile.insuredPerson.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="text-gray-900">
                    {profile.insuredPerson.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="text-gray-900">
                    {new Date(
                      profile.insuredPerson.dateOfBirth
                    ).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">CIN</p>
                  <p className="text-gray-900">{profile.insuredPerson.cin}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">NIF</p>
                  <p className="text-gray-900">{profile.insuredPerson.nif}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informations blockchain */}
        {profile.walletAddress && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-600" />
              Blockchain
            </h3>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-gray-500">Adresse Wallet</p>
                <p className="text-gray-900 font-mono text-sm">
                  {profile.walletAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informations compagnie d'assurance */}
        {profile.insuranceCompany && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-gray-600" />
              Compagnie d'Assurance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="text-gray-900">
                    {profile.insuranceCompany.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">
                    {profile.insuranceCompany.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="text-gray-900">
                    {profile.insuranceCompany.phone1}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="text-gray-900">
                    {profile.insuranceCompany.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
