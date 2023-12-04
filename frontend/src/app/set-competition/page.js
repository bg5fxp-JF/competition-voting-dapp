"use client";
import { useEffect } from "react";
import FinalistInput from "./components/FinalistInput";
import JudgesInput from "./components/JudgesInput";
import WeightageInput from "./components/WeightageInput";
import { useApprovedData } from "../context/ApprovedContext";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function page() {
	const IS_DISABLED = false;
	const { isApproved } = useApprovedData();
	const { isConnected } = useAccount();
	const router = useRouter();
	useEffect(() => {
		if (!isApproved) {
			router.push("/");
		}
	}, [isApproved]);
	return (
		<div className="flex flex-col gap-7  justify-center mt-36 mb-24 px-6 sm:px-16 ">
			<div className="flex flex-col gap-7 justify-center sm:flex-row">
				<div className="flex flex-col gap-y-7">
					<h3 className="-mb-3">Select Judges</h3>
					<JudgesInput isDisabled={IS_DISABLED} />

					<h3 className="-mb-3">Select Finalists</h3>
					<FinalistInput isDisabled={IS_DISABLED} />
				</div>
				<div className="flex flex-col gap-y-7">
					<h3 className="-mb-3">Select Weightages</h3>
					<WeightageInput isDisabled={IS_DISABLED} />
				</div>
			</div>
			<button
				disabled={IS_DISABLED}
				className="mx-auto p-2 rounded border border-primaryColor dark:bg-primaryColor/70 shadow-md "
			>
				Start Voting
			</button>
			<button
				disabled={!IS_DISABLED}
				className="mx-auto p-2 rounded border border-primaryColor dark:bg-primaryColor/70 shadow-md "
			>
				End Voting
			</button>
		</div>
	);
}
