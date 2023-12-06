"use client";

import { abi, contractAddresses } from "@/app/constants";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export default function StartButton({ isDisabled }) {
	const { toast } = useToast();

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { write } = useContractWrite({
		address: competitionAddress,
		abi: abi,
		functionName: "startVoting",
		onError(error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		},
		onSuccess() {
			toast({
				title: "Successfuly Started Competition",
			});
		},
	});

	return (
		<button
			disabled={isDisabled}
			onClick={() => write()}
			className={`mx-auto p-2 rounded border border-primaryColor  shadow-md ${
				isDisabled
					? "bg-[#fafafa] dark:bg-primaryColor/10"
					: "dark:bg-primaryColor/70"
			}  `}
		>
			Start Voting
		</button>
	);
}
