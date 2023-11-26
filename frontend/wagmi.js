import { configureChains, createConfig } from "wagmi";
import { sepolia, localhost } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[sepolia, localhost],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_API }), publicProvider()]
);

export const config = createConfig({
	autoConnect: false,
	connectors: [new MetaMaskConnector({ chains })],
	publicClient,
	webSocketPublicClient,
});
