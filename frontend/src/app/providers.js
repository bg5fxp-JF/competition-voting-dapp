"use client";
import { WagmiConfig } from "wagmi";
import { config } from "../../wagmi";

export function Providers({ children }) {
	return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
