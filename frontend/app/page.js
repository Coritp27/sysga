import { Button } from "@/components/ui/button";

import { HomeIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import Link from "next/link";

export default function Home() {
  return (
    <div className="home">
      <div className="home_inner">
        <h1 className="home_inner_title">
          Une plateforme pour gérer et vérifier vos{" "}
          <span className="home_inner_title_colored">cartes d'assurance</span>{" "}
          en toute simplicité.
        </h1>
        <p className="home_inner_description">
          SysGa vous permet d'enregistrer et suivre vos cartes d'assurance sur
          la blockchain pour une expérience transparente et sécurisée.
        </p>
        <div className="home_inner_links">
          <Link href="add" className="mr-5">
            <Button className="home_inner_links_button1 hover:bg-[#4caf50]">
              <HomeIcon className="mr-2" /> Ajouter une carte d'assurance
            </Button>
          </Link>
          <Link href="get" className="ml-5">
            <Button className="home_inner_links_button2">
              <EyeOpenIcon className="mr-2" /> Voir une carte d'assurance
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
