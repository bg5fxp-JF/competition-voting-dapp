"use client";
import { useEffect } from "react";
import FinalistInput from "./components/FinalistInput";
import JudgesInput from "./components/JudgesInput";
import WeightageInput from "./components/WeightageInput";
import { useApprovedData } from "../context/ApprovedContext";

import { useRouter } from "next/navigation";
import StartButton from "./components/StartButton";
import EndButton from "./components/EndButton";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { abi, contractAddresses } from "../constants";

export default function page() {
	const { isApproved } = useApprovedData();
	const router = useRouter();

	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const isDisabled = useContractRead({
		address: competitionAddress,
		abi: abi,
		functionName: "getVotingStatus",
		watch: true,
	}).data;

	useEffect(() => {
		if (!isApproved) {
			router.push("/");
		}
	}, [isApproved]);
	return (
		<div className="flex flex-col gap-7  justify-center mt-44 mb-24 px-6 sm:px-16 ">
			<div className="flex flex-col gap-7 justify-center sm:flex-row">
				<div className="flex flex-col gap-y-7">
					<h3 className="-mb-3 font-bold">Select Judges</h3>
					<JudgesInput isDisabled={isDisabled} />

					<h3 className="-mb-3 font-bold">Select Finalists</h3>
					<FinalistInput isDisabled={isDisabled} />
				</div>
				<div className="flex flex-col gap-y-7">
					<h3 className="-mb-3 font-bold">Select Weightages</h3>
					<WeightageInput isDisabled={isDisabled} />
				</div>
			</div>
			<StartButton isDisabled={isDisabled} />

			<EndButton isDisabled={!isDisabled} />
		</div>
	);
}
