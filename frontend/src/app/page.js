"use client";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { FaArrowDown } from "react-icons/fa";

export default function Home() {
	const { connect } = useConnect({
		connector: new MetaMaskConnector(),
	});

	const { isConnected } = useAccount();

	if (isConnected) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				Get Capabilites for
			</div>
		);
	}

	return (
		<>
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col gap-5 items-center">
					<h4 className="text-3xl">To Get Started</h4>
					<FaArrowDown className=" animate-bounce" />
					<button
						onClick={() => connect()}
						className="bg-primaryColor p-4 rounded transition-all active:scale-125"
					>
						Connect Wallet
					</button>
				</div>
			</div>
		</>
	);
}
