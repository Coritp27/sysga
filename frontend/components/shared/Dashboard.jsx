import { Button } from "@/components/ui/button";
import { HomeIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function DashboardClient({ insuredPersons }) {
  return (
    <div className="home_inner_links">
      <Link href="add" className="mr-5">
        <Button className="home_inner_links_button1 hover:bg-[#4caf50]">
          <HomeIcon className="mr-2" /> Ajouter une carte d'assurance.
        </Button>
      </Link>
      <Link href="get" className="ml-5">
        <Button className="home_inner_links_button2">
          <EyeOpenIcon className="mr-2" /> Voir une carte d'assurance.
        </Button>
      </Link>
      <pre>{JSON.stringify(insuredPersons, null, 2)}</pre>
    </div>
  );
}
