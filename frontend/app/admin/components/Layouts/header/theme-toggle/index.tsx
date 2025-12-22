import React from "react";
import { Sun } from "./icons";

export function ThemeToggleSwitch() {
  return (
    <div className="rounded-full bg-gray-3 p-[5px] text-[#111928]">
      <span className="sr-only">Mode clair activé</span>
      <span aria-hidden className="relative flex gap-2.5">
        <span className="absolute size-[38px] rounded-full border border-gray-200 bg-white" />
        <span className="relative grid size-[38px] place-items-center rounded-full">
          <Sun />
        </span>
      </span>
    </div>
  );
}
