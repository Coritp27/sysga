"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Configuration RPC avec fallback et gestion côté client
const getSepoliaRpcUrl = () => {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
      "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
  }
  // Fallback pour le rendu côté serveur
  return "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
};

const RainbowKitAndWagmiProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const sepoliaRpcUrl = getSepoliaRpcUrl();

    const wagmiConfig = createConfig({
      chains: [sepolia],
      transports: {
        [sepolia.id]: http(sepoliaRpcUrl, {
          timeout: 60000, // 60 secondes
          retryCount: 5,
          retryDelay: 2000,
          batch: {
            batchSize: 1024,
            wait: 16,
          },
        }),
      },
    });

    setConfig(wagmiConfig);
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: 1000,
      },
    },
  });

  // Afficher un fallback pendant le chargement côté client
  if (!isClient || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">
            Chargement de la configuration blockchain...
          </p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={[sepolia]}
          theme={darkTheme({
            accentColor: "#4caf50",
            accentColorForeground: "black",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitAndWagmiProvider;
