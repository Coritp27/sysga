"use client";

import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user: clerkUser } = useUser();
  const { profile, loading, error } = useUserProfile();
  const [data, setData] = useState({
    name: "Chargement...",
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

  // Mettre à jour les données quand le profil est chargé
  React.useEffect(() => {
    if (profile) {
      const fullName = profile.insuredPerson
        ? `${profile.insuredPerson.firstName} ${profile.insuredPerson.lastName}`
        : profile.username;

      setData((prev) => ({
        ...prev,
        name: fullName,
      }));
    }
  }, [profile]);

  const handleChange = (e: any) => {
    if (e.target.name === "profilePhoto") {
      const file = e.target?.files[0];

      setData({
        ...data,
        profilePhoto: file && URL.createObjectURL(file),
      });
    } else if (e.target.name === "coverPhoto") {
      const file = e.target?.files[0];

      setData({
        ...data,
        coverPhoto: file && URL.createObjectURL(file),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="text-center py-8">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun profil trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />

              <CameraIcon />

              <span>Edit</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {data?.profilePhoto && (
                <>
                  <Image
                    src={data?.profilePhoto}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />

                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <CameraIcon />

                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {data?.name}
            </h3>
            <p className="font-medium">{profile.role?.name || "Utilisateur"}</p>

            {/* Informations utilisateur */}
            <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  {profile.userType}
                </span>
                <span className="text-body-sm">Type</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  {profile.isActive ? "Actif" : "Inactif"}
                </span>
                <span className="text-body-sm">Statut</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  {profile.insuredPerson?.numberOfDependent || 0}
                </span>
                <span className="text-body-sm-sm">Dépendants</span>
              </div>
            </div>

            <div className="mx-auto max-w-[720px]">
              <h4 className="font-medium text-dark dark:text-white">
                Informations Personnelles
              </h4>
              <div className="mt-4 space-y-2 text-left">
                {profile.insuredPerson && (
                  <>
                    <p>
                      <strong>Email:</strong> {profile.insuredPerson.email}
                    </p>
                    <p>
                      <strong>Téléphone:</strong> {profile.insuredPerson.phone}
                    </p>
                    <p>
                      <strong>Adresse:</strong> {profile.insuredPerson.address}
                    </p>
                    <p>
                      <strong>CIN:</strong> {profile.insuredPerson.cin}
                    </p>
                    <p>
                      <strong>NIF:</strong> {profile.insuredPerson.nif}
                    </p>
                    <p>
                      <strong>Date de naissance:</strong>{" "}
                      {new Date(
                        profile.insuredPerson.dateOfBirth
                      ).toLocaleDateString("fr-FR")}
                    </p>
                    <p>
                      <strong>Genre:</strong> {profile.insuredPerson.gender}
                    </p>
                  </>
                )}

                {profile.walletAddress && (
                  <p>
                    <strong>Adresse Wallet:</strong> {profile.walletAddress}
                  </p>
                )}

                {profile.insuranceCompany && (
                  <>
                    <h5 className="font-medium text-dark dark:text-white mt-4">
                      Compagnie d'Assurance
                    </h5>
                    <p>
                      <strong>Nom:</strong> {profile.insuranceCompany.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.insuranceCompany.email}
                    </p>
                    <p>
                      <strong>Téléphone:</strong>{" "}
                      {profile.insuranceCompany.phone1}
                    </p>
                    <p>
                      <strong>Adresse:</strong>{" "}
                      {profile.insuranceCompany.address}
                    </p>
                    {profile.insuranceCompany.website && (
                      <p>
                        <strong>Site web:</strong>{" "}
                        {profile.insuranceCompany.website}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <SocialAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}
