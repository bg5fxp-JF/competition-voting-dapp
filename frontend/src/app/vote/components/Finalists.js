"use client";

import { useEffect, useState } from "react";
import FinalistCard from "./FinalistCard";
import {
	useAccount,
	useContractRead,
	useContractReads,
	useNetwork,
} from "wagmi";
import { abi, contractAddresses } from "@/app/constants";

export default function Finalists() {
	const [finalists, setFinalists] = useState([]);

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const [isDisabled, setDisabled] = useState();

	const { data, isError } = useContractReads({
		contracts: [
			{
				address: competitionAddress,
				abi: abi,
				functionName: "getVotingStatus",
			},
			{
				address: competitionAddress,
				abi: abi,
				functionName: "getFinalists",
			},
		],
		watch: true,
	});

	useEffect(() => {
		if (data != undefined) {
			setDisabled(data[0].result);
			setFinalists(data[1].result);
		} else {
			setDisabled(false);
		}
	}, [data]);

	if (!isDisabled) {
		return (
			<h4 className="text-lg font-bold">Competition has not been set up</h4>
		);
	}

	return (
		<div className="flex flex-col gap-5 items-center">
			<h4 className="text-lg font-bold">The Finalists Are...</h4>
			<div className="flex flex-wrap w-full justify-center mx-auto px-6 gap-4 sm:px-0">
				{finalists.map((address, index) => {
					const rand = Math.floor(Math.random() * 20) + 1;
					return (
						<FinalistCard
							key={index}
							img={`https://picsum.photos/id/${index + 1 * rand}/200`}
							address={address}
						/>
					);
				})}
			</div>
		</div>
	);
}
