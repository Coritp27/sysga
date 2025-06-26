import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {/* <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li> */}
          <li className="font-medium text-primary flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                Wallet pour blockchain:
              </span>
              <ConnectButton showBalance={false} />
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
