"use client";
import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { abi, contractAddresses } from "@/app/constants";
import { useToast } from "@/components/ui/use-toast";

export default function JudgesInput({ isDisabled }) {
	const [judges, setJudges] = useState([""]);
	const { toast } = useToast();

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { write } = useContractWrite({
		address: competitionAddress,
		abi: abi,
		functionName: "selectJudges",
		args: [judges],
		onError(error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		},
		onSuccess() {
			toast({
				title: "Successfuly Selected Judges",
			});
		},
	});

	function handleJudgeAdd() {
		setJudges([...judges, ""]);
	}
	function handleJudgeRemove(index) {
		const list = [...judges];
		list.splice(index, 1);
		setJudges(list);
	}

	function handleJudgeChange(e, index) {
		const { value } = e.target;
		const list = [...judges];
		list[index] = value;
		setJudges(list);
	}

	useEffect(() => {
		if (isDisabled) setJudges(window.localStorage.getItem("judges").split(","));
	}, [isDisabled]);

	return (
		<div className="flex flex-col gap-4  transition-all">
			{judges.map((judge, index) => {
				return (
					<div key={index} className="flex gap-x-3 ">
						<div
							className={`p-2 rounded shadow-md w-full dark:bg-gray-700 ${
								isDisabled && "bg-[#fafafa] dark:bg-gray-800"
							} `}
						>
							<input
								placeholder="Enter an address"
								className={` dark:bg-gray-700 focus-visible:outline-none w-full ${
									isDisabled && "bg-[#fafafa] dark:bg-gray-800 "
								} `}
								disabled={isDisabled}
								type="text"
								required
								value={judge}
								onChange={(e) => handleJudgeChange(e, index)}
							/>
						</div>

						{judges.length > 1 && !isDisabled && (
							<button
								onClick={() => handleJudgeRemove(index)}
								className="p-2 rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md "
							>
								<MinusIcon />
							</button>
						)}
					</div>
				);
			})}
			{judges.length < 3 && !isDisabled && (
				<div className="flex gap-x-2">
					<button
						onClick={() => handleJudgeAdd()}
						className="flex w-full p-2 justify-center rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md "
					>
						<PlusIcon width={20} height={20} />
					</button>

					<button
						onClick={() => {
							write();
							window.localStorage.setItem("judges", judges);
						}}
						className={`flex p-2 w-full  justify-center text-sm  rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md transition-all ${
							judges[0].length == 42 ? "" : "hidden"
						} `}
					>
						Submit
					</button>
				</div>
			)}
		</div>
	);
}
