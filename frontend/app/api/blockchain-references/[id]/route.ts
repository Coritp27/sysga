import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const deletedReference = await prismadb.blockchainReference.delete({
      where: { id },
    });

    return NextResponse.json(deletedReference);
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la référence blockchain:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la référence blockchain" },
      { status: 500 }
    );
  }
}
