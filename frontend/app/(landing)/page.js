import { auth } from "@clerk/nextjs/server";
import Home from "@/components/shared/Home";
import { redirect } from "next/navigation";

export default async function Landing() {
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
