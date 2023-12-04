"use client";
import { useState } from "react";

export default function WeightageInput({ isDisabled }) {
	const [judgeWeight, setJudgeWeight] = useState(0);
	const [finalistWeight, setFinalistWeight] = useState(0);

	return (
		<div className="flex flex-col gap-3">
			<div className={`p-2 rounded shadow-md ${isDisabled && "bg-[#fafafa]"} `}>
				<input
					placeholder="Enter Judge Weight"
					className={` focus-visible:outline-none ${
						isDisabled && "bg-[#fafafa]"
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
			<div className={`p-2 rounded shadow-md ${isDisabled && "bg-[#fafafa]"} `}>
				<input
					placeholder="Enter Finalist Weight"
					className={` focus-visible:outline-none ${
						isDisabled && "bg-[#fafafa]"
					} `}
					disabled={isDisabled}
					type="number"
					min={0.1}
					required
					onChange={(e) => {
						setFinalistWeight(e.target.value);
					}}
				/>
			</div>
		</div>
	);
}
