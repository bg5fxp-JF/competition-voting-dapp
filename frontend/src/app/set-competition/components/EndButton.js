"use client";

import { abi, contractAddresses } from "@/app/constants";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export default function EndButton({ isDisabled }) {
	const { toast } = useToast();

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { write } = useContractWrite({
		address: competitionAddress,
		abi: abi,
		functionName: "endVoting",
		onError(error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		},
		onSuccess() {
			toast({
				title: "Successfuly Ended Competition",
			});
		},
	});

	return (
		<button
			disabled={isDisabled}
			onClick={() => {
				write();
				window.localStorage.removeItem("judges");
				window.localStorage.removeItem("finalists");
				window.localStorage.removeItem("judgeWeight");
				window.localStorage.removeItem("audienceWeight");
			}}
			className={`mx-auto p-2 rounded border border-primaryColor dark:bg-primaryColor/70 shadow-md ${
				isDisabled && "bg-[#fafafa] dark:bg-primaryColor/10"
			}  `}
		>
			End Voting
		</button>
	);
}
