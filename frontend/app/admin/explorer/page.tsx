import ExplorerPage from "@/app/explorer/page";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminExplorerPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const metaTypeRaw =
    (user?.publicMetadata?.userType as string | undefined) ||
    (user?.privateMetadata?.userType as string | undefined);
  const metaType = metaTypeRaw
    ? metaTypeRaw.toString().toUpperCase()
    : "INSURER";

  if (metaType === "INSURER") {
    redirect("/admin/dashboard");
  }

  return <ExplorerPage />;
}
