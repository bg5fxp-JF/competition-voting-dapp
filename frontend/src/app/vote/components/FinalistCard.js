"use client";

import { abi, contractAddresses } from "@/app/constants";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useEffect } from "react";
import {
	useAccount,
	useContractRead,
	useContractWrite,
	useNetwork,
	useWalletClient,
} from "wagmi";

export default function FinalistCard({ img, address }) {
	const { toast } = useToast();

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { write } = useContractWrite({
		address: competitionAddress,
		abi: abi,
		functionName: "castVote",
		args: [address],
		onError(error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		},
		onSuccess() {
			toast({
				title: `Successfuly Voted for ${formatAddress(address)}`,
				description:
					"You can change your vote but it will always only count as one vote.",
			});
		},
	});

	const { data: walletClient } = useWalletClient();

	const { data } = useContractRead({
		address: competitionAddress,
		abi: abi,
		functionName: "getCurrentVote",
		watch: true,
		account: walletClient != undefined ? walletClient.account : null,
	});

	function formatAddress(address) {
		return address.slice(0, 20) + "..." + address.slice(address.length - 4);
	}
	return (
		<div className="group relative rounded  shadow-md overflow-hidden">
			<Image
				src={img}
				alt=""
				width={300}
				height={500}
				className="object-cover"
			/>
			<div class="absolute w-full flex justify-center top-3 px-3">
				<div class="   p-1 text-center text-sm text-black rounded bg-white/30">
					{formatAddress(address)}
				</div>
			</div>
			{data == address ? (
				<div className="absolute flex justify-center   items-center min-h-[50%]   bottom-0 w-full bg-white/50 dark:bg-slate-950/50 ">
					<p className="text-6xl font-bold ">Voted</p>
				</div>
			) : (
				<div className="absolute flex justify-center   items-center min-h-[50%] transition-all translate-y-full bottom-0 w-full bg-white/50 dark:bg-slate-950/50 cursor-pointer group-hover:-translate-y-[0.5]">
					<button
						onClick={() => write()}
						className="text-6xl font-bold group-active:text-white"
					>
						Vote
					</button>
				</div>
			)}
		</div>
	);
}
