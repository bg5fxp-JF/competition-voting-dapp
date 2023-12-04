"use client";
import { useAccount, useConnect, useContractRead, useNetwork } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { FaArrowDown } from "react-icons/fa";
import Link from "next/link";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { useApprovedData } from "./context/ApprovedContext";

export default function Home() {
	const { connect } = useConnect({
		connector: new MetaMaskConnector(),
	});

	const { isApproved } = useApprovedData();
	const { isConnected } = useAccount();

	const router = useRouter();

	useEffect(() => {
		if (isApproved) {
			router.push("/set-competition");
		}
	}, [isApproved]);

	if (isConnected) {
		return (
			<div className="container flex min-h-screen items-center mx-auto justify-center">
				<div className="flex flex-col gap-5 px-6 items-center">
					<h4 className=" text-center text-lg">
						You can now get capabilites to set up a competiton
					</h4>
					<FaArrowDown className=" animate-bounce" />
					<button className="bg-primaryColor dark:bg-primaryColor/70 p-4 rounded transition-all active:scale-125">
						Get Capabilites
					</button>

					<h4 className="pt-5 text-lg ">
						Or you can{" "}
						<Link
							href="/"
							className="text-primaryColor dark:text-primaryColor/70 underline"
						>
							cast a vote
						</Link>
					</h4>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col gap-5 items-center">
					<h4 className="text-lg">To Get Started</h4>
					<FaArrowDown className=" animate-bounce" />
					<button
						onClick={() => {
							connect();

							window.localStorage.setItem("connected", "inject");
						}}
						className="bg-primaryColor dark:bg-primaryColor/70 p-4 rounded transition-all active:scale-125"
					>
						Connect Wallet
					</button>
				</div>
			</div>
		</>
	);
}
