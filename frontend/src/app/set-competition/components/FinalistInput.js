"use client";
import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import {
	useAccount,
	useContractRead,
	useContractWrite,
	useNetwork,
} from "wagmi";
import { abi, contractAddresses } from "@/app/constants";
import { useToast } from "@/components/ui/use-toast";

export default function FinalistInput({ isDisabled }) {
	const [finalists, setFinalists] = useState([""]);
	const { toast } = useToast();

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { write } = useContractWrite({
		address: competitionAddress,
		abi: abi,
		functionName: "selectFinalists",
		args: [finalists],
		onError(error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error.message,
			});
		},
		onSuccess() {
			toast({
				title: "Successfuly Selected Finalists",
			});
		},
	});

	const { data } = useContractRead({
		address: competitionAddress,
		abi: abi,
		functionName: "getFinalists",
		watch: true,
	});

	function handleFinalistAdd() {
		setFinalists([...finalists, ""]);
	}
	function handleFinalistRemove(index) {
		const list = [...finalists];
		list.splice(index, 1);
		setFinalists(list);
	}

	function handleFinalistChange(e, index) {
		const { value } = e.target;
		const list = [...finalists];
		list[index] = value;
		setFinalists(list);
	}

	useEffect(() => {
		if (isDisabled) {
			if (data != undefined) setFinalists(data);
		}
	}, [isDisabled]);

	return (
		<div className="flex flex-col gap-4 transition-all">
			{finalists.map((finalist, index) => {
				return (
					<div key={index} className="flex gap-x-3">
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
								value={finalist}
								onChange={(e) => handleFinalistChange(e, index)}
							/>
						</div>

						{finalists.length > 1 && !isDisabled && (
							<button
								onClick={() => handleFinalistRemove(index)}
								className="p-2 rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md "
							>
								<MinusIcon />
							</button>
						)}
					</div>
				);
			})}
			{finalists.length < 4 && !isDisabled && (
				<div className="flex gap-x-2">
					<button
						onClick={() => handleFinalistAdd()}
						className="flex p-2 w-full justify-center rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md "
					>
						<PlusIcon width={20} height={20} />
					</button>
					<button
						onClick={() => {
							write();
						}}
						className={`flex p-2 w-full  justify-center text-sm  rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md transition-all ${
							finalists[0].length == 42 && finalists.length > 1 ? "" : "hidden"
						} `}
					>
						Submit
					</button>
				</div>
			)}
		</div>
	);
}
