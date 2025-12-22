import { auth, currentUser } from "@clerk/nextjs/server";
import Home from "@/components/shared/Home";
import { redirect } from "next/navigation";

export default async function Landing() {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();
    const metaTypeRaw =
      user?.publicMetadata?.userType ?? user?.privateMetadata?.userType;
    const metaType = metaTypeRaw
      ? metaTypeRaw.toString().toUpperCase()
      : "INSURER";

    if (metaType === "MEDICAL") {
      redirect("/admin/explorer");
    }

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
