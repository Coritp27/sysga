"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";

const Header = () => {
  const { userId } = useAuth();

  return (
    <nav className="navbar">
      <div className="grow">
        <Link href="/">
          <Image src="/logo.png" width="150" height="30" alt="logo" />
        </Link>
      </div>
      <div>
        {userId ? (
          <div className="flex gap-2">
            <ConnectButton showBalance={false} />
            <SignOutButton className=" text-black font-bold rounded-full px-4 py-2 hover:bg-[#4caf50] hover:text-black" />
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
