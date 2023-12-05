"use client";
import { abi, contractAddresses } from "@/app/constants";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export default function WeightageInput({ isDisabled }) {
	const [judgeWeight, setJudgeWeight] = useState(0);
	const [audienceWeight, setAudienceWeight] = useState(0);
	const { toast } = useToast();

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { write } = useContractWrite({
		address: competitionAddress,
		abi: abi,
		functionName: "inputWeightage",
		args: [judgeWeight, audienceWeight],
		onError(error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		},
		onSuccess() {
			toast({
				title: "Successfuly Selected Weightages",
			});
		},
	});

	return (
		<div className="flex flex-col gap-3">
			<div
				className={`p-2 rounded shadow-md dark:bg-gray-700 ${
					isDisabled && "bg-[#fafafa] dark:bg-gray-800"
				} `}
			>
				<input
					placeholder="Enter Judge Weight"
					className={` dark:bg-gray-700 focus-visible:outline-none w-full ${
						isDisabled && "bg-[#fafafa] dark:bg-gray-800 "
					} `}
					type="number"
					disabled={isDisabled}
					min={0.1}
					required
					onChange={(e) => {
						setJudgeWeight(e.target.value);
					}}
				/>
			</div>
			<div
				className={`p-2 rounded shadow-md dark:bg-gray-700 ${
					isDisabled && "bg-[#fafafa] dark:bg-gray-800"
				} `}
			>
				<input
					placeholder="Enter Audience Weight"
					className={` dark:bg-gray-700 focus-visible:outline-none w-full ${
						isDisabled && "bg-[#fafafa] dark:bg-gray-800 "
					} `}
					disabled={isDisabled}
					type="number"
					min={0.1}
					required
					onChange={(e) => {
						setAudienceWeight(e.target.value);
					}}
				/>
			</div>
			{judgeWeight > 0 && audienceWeight > 0 && (
				<button
					onClick={() => write()}
					className="flex p-2 w-full  justify-center text-sm  rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md transition-all"
				>
					Submit
				</button>
			)}
		</div>
	);
}
