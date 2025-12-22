import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { UserType } from "@prisma/client";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Lire éventuellement le userType depuis Clerk (metadata)
    let userTypeFromClerk: UserType | null = null;
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      const metaType =
        (clerkUser.publicMetadata?.userType as string | undefined) ||
        (clerkUser.privateMetadata?.userType as string | undefined);

      if (
        metaType &&
        (["INSURER", "MEDICAL", "ADMIN"] as string[]).includes(metaType)
      ) {
        userTypeFromClerk = metaType as UserType;
      }
    } catch (e) {
      console.warn(
        "[API user/profile] Impossible de lire userType depuis Clerk",
        e
      );
    }

    let user = await prismadb.user.findFirst({
      where: {
        idClerk: userId,
        isDeleted: false,
      },
      include: {
        role: true,
        insuredPerson: true,
        insuranceCompany: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Synchroniser éventuellement le userType en base avec Clerk
    if (userTypeFromClerk && user.userType !== userTypeFromClerk) {
      user = await prismadb.user.update({
        where: { id: user.id },
        data: { userType: userTypeFromClerk },
        include: {
          role: true,
          insuredPerson: true,
          insuranceCompany: true,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil utilisateur:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userType } = body as { userType?: UserType | string };

    const allowedTypes = Object.values(UserType);

    if (!userType || !allowedTypes.includes(userType as UserType)) {
      return NextResponse.json(
        {
          error:
            "Valeur de userType invalide. Utiliser INSURER, MEDICAL ou ADMIN.",
        },
        { status: 400 }
      );
    }

    // D'abord mettre à jour Clerk (source d'autorité pour userType)
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...(clerkUser.publicMetadata || {}),
          userType,
        },
      });
    } catch (e) {
      console.error(
        "[API user/profile PATCH] Impossible de mettre à jour userType dans Clerk",
        e
      );
      return NextResponse.json(
        { error: "Impossible de mettre à jour le type utilisateur côté auth" },
        { status: 502 }
      );
    }

    // Puis synchroniser Prisma avec cette nouvelle valeur
    let user = await prismadb.user.findFirst({
      where: {
        idClerk: userId,
        isDeleted: false,
      },
      include: {
        role: true,
        insuredPerson: true,
        insuranceCompany: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    user = await prismadb.user.update({
      where: { id: user.id },
      data: {
        userType: userType as UserType,
        lastModifiedBy: "self-service",
      },
      include: {
        role: true,
        insuredPerson: true,
        insuranceCompany: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du profil utilisateur:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
