"use client";

import NotConnected from "@/components/shared/NotConnected";
import GetCard from "@/components/shared/GetCard";

import { useAccount } from "wagmi";

const page = () => {
  const { isConnected } = useAccount();

  return <div>{isConnected ? <GetCard /> : <NotConnected />}</div>;
};

export default page;
