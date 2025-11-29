import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="w-full flex justify-end p-4">
        <div className="flex gap-4">
          <Link href="/sign-up">
            <Button className="bg-[#4caf50] text-white rounded-full px-4 py-2 hover:bg-[#4caf50] hover:text-black">
              Se Connecter
            </Button>
          </Link>
        </div>
      </header>
      <main className="text-center mt-16 px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Bienvenue sur VeriCarte, une plateforme moderne pour gérer et vérifier vos{" "}
          <span className="text-[#4caf50]">cartes d'assurance santé</span> en toute
          simplicité.
        </h1>
        <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
        VeriCarte vous permet d'enregistrer et suivre vos cartes d'assurance santé sur
          la blockchain pour une expérience transparente et sécurisée.
        </p>
        <Image
          src="/images/insurance-cards.png"
          alt="Insurance Cards"
          width={400}
          height={300}
          className="rounded-lg shadow-md mx-auto"
        />
      </main>
    </div>
  );
}
