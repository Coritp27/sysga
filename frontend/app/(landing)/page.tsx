import { auth } from "@clerk/nextjs/server";
import Home from "@/components/shared/Home";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

export default async function Landing(): Promise<ReactElement> {
  const { userId } = await auth();

  if (userId) {
    redirect("/admin");
  }

  return (
    <div className="home">
      <div className="home_inner">
        <Home />
      </div>
    </div>
  );
}
