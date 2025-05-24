import { auth } from "@clerk/nextjs/server";
import Home from "@/components/shared/Home";
import Dashboard from "@/components/shared/Dashboard";

export default async function Landing() {
  const { userId } = await auth();
  return (
    <div className="home">
      <div className="home_inner">{userId ? <Dashboard /> : <Home />}</div>
    </div>
  );
}
