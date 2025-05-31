import { auth } from "@clerk/nextjs/server";
import Home from "@/components/shared/Home";
import DashboardClient from "@/components/shared/Dashboard";
import prisma from "@/lib/prismadb";

export default async function Landing() {
  const { userId } = await auth();

  let insuredPersons = [];
  if (userId) {
    insuredPersons = await prisma.insuredPerson.findMany({
      where: { userId: "1" },
    });
  }

  return (
    <div className="home">
      <div className="home_inner">
        {userId ? (
          <DashboardClient insuredPersons={insuredPersons} />
        ) : (
          <Home />
        )}
      </div>
    </div>
  );
}
