"use client";

import NotConnected from "@/components/shared/NotConnected";
import CreateCard from "@/components/shared/CreateCard";

import { useAccount } from "wagmi";

const page = () => {
  const { isConnected } = useAccount();

  return <div>{isConnected ? <CreateCard /> : <NotConnected />}</div>;
};

export default page;
