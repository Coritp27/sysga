import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - List all policies for the user's company
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { idClerk: userId, isDeleted: false },
    });

    if (!user?.insuranceCompanyId)
      return NextResponse.json({ error: "No company" }, { status: 403 });

    const policies = await prisma.policy.findMany({
      where: { insuranceCompanyId: user.insuranceCompanyId },
      orderBy: { id: "desc" },
    });

    // Convert BigInt to Number for JSON serialization
    const serializedPolicies = policies.map((policy) => ({
      ...policy,
      policyNumber: Number(policy.policyNumber),
    }));

    return NextResponse.json(serializedPolicies);
  } catch (error: any) {
    console.error("GET /api/policies error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new policy for the user's company
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("Creating policy for user:", userId);

  const user = await prisma.user.findFirst({
    where: { idClerk: userId, isDeleted: false },
  });

  console.log("Found user:", user);

  if (!user?.insuranceCompanyId)
    return NextResponse.json({ error: "No company" }, { status: 403 });

  const body = await request.json();
  console.log("Request body:", body);

  // Correction: ensure validUntil is a Date object
  if (body.validUntil) {
    body.validUntil = new Date(body.validUntil);
  }

  try {
    // Generate next available policy number if not provided or if it already exists
    let policyNumber = body.policyNumber;
    if (!policyNumber || policyNumber <= 0) {
      const lastPolicy = await prisma.policy.findFirst({
        where: { insuranceCompanyId: user.insuranceCompanyId },
        orderBy: { policyNumber: "desc" },
      });
      policyNumber = lastPolicy ? Number(lastPolicy.policyNumber) + 1 : 1;
    } else {
      // Check if policy number already exists
      const existingPolicy = await prisma.policy.findFirst({
        where: {
          policyNumber: policyNumber,
          insuranceCompanyId: user.insuranceCompanyId,
        },
      });
      if (existingPolicy) {
        // Find next available number
        const lastPolicy = await prisma.policy.findFirst({
          where: { insuranceCompanyId: user.insuranceCompanyId },
          orderBy: { policyNumber: "desc" },
        });
        policyNumber = lastPolicy ? Number(lastPolicy.policyNumber) + 1 : 1;
      }
    }

    const newPolicy = await prisma.policy.create({
      data: {
        ...body,
        policyNumber: policyNumber,
        insuranceCompanyId: user.insuranceCompanyId,
      },
    });
    console.log("Created policy:", newPolicy);

    // Convert BigInt to Number for JSON serialization
    const serializedPolicy = {
      ...newPolicy,
      policyNumber: Number(newPolicy.policyNumber),
    };

    return NextResponse.json(serializedPolicy, { status: 201 });
  } catch (e: any) {
    console.error("Error creating policy:", e);
    if (e instanceof Error && e.stack) {
      console.error(e.stack);
    }
    return NextResponse.json(
      { error: "Error creating policy", details: e?.message || e },
      { status: 500 }
    );
  }
}

// PUT - Update a policy (only if it belongs to the user's company)
export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findFirst({
    where: { idClerk: userId, isDeleted: false },
  });
  if (!user?.insuranceCompanyId)
    return NextResponse.json({ error: "No company" }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  const policy = await prisma.policy.findUnique({ where: { id } });
  if (!policy || policy.insuranceCompanyId !== user.insuranceCompanyId) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  try {
    const updated = await prisma.policy.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Error updating policy" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a policy (only if it belongs to the user's company)
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findFirst({
    where: { idClerk: userId, isDeleted: false },
  });
  if (!user?.insuranceCompanyId)
    return NextResponse.json({ error: "No company" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const policy = await prisma.policy.findUnique({ where: { id } });
  if (!policy || policy.insuranceCompanyId !== user.insuranceCompanyId) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  try {
    await prisma.policy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Error deleting policy" },
      { status: 500 }
    );
  }
}
