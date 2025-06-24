"use client";

import NotConnected from "@/components/shared/NotConnected";
import CreateCard from "@/components/shared/CreateCard";
import ContractDiagnostic from "@/components/shared/ContractDiagnostic";
import { useAccount } from "wagmi";

const TestPage = () => {
  const { isConnected } = useAccount();

  return (
    <div className="space-y-8">
      {isConnected ? (
        <>
          <ContractDiagnostic />
          <CreateCard />
        </>
      ) : (
        <NotConnected />
      )}
    </div>
  );
};

export default TestPage;
