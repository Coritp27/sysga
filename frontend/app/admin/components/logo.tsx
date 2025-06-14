import React from "react";
import darkLogo from "../../../public/logo.png";
import logo from "../../../public/logo.png";
import Image from "next/image";

export function Logo() {
  return (
    <div>
      <Image
        src={logo}
        width={170}
        height={30}
        className="dark:hidden"
        alt="SysGa Admin logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
