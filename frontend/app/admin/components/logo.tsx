import React from "react";
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/images/logo/logo.svg"
        width={120}
        height={32}
        className="h-8 w-auto dark:hidden"
        alt="VeriCarte"
        priority
      />
      <Image
        src="/images/logo/logo-dark.svg"
        width={120}
        height={32}
        className="h-8 w-auto hidden dark:block"
        alt="VeriCarte"
        priority
      />
    </div>
  );
}

export function LogoIcon() {
  return (
    <div className="flex items-center">
      <Image
        src="/images/logo/logo-icon.svg"
        width={32}
        height={32}
        className="h-8 w-8"
        alt="SYSGA"
        priority
      />
    </div>
  );
}
