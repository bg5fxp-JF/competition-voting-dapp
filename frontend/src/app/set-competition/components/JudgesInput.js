"use client";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

export default function JudgesInput({ isDisabled }) {
	const [judges, setJudges] = useState([""]);

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
	return (
		<div className="flex flex-col gap-4  transition-all">
			{judges.map((judge, index) => {
				return (
					<div key={index} className="flex gap-x-3 ">
						<div
							className={`p-2 rounded shadow-md w-full ${
								isDisabled && "bg-[#fafafa]"
							} `}
						>
							<input
								placeholder="Enter an address"
								className=" focus-visible:outline-none "
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
				<button
					onClick={() => handleJudgeAdd()}
					className="flex p-2  justify-center rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md "
				>
					<PlusIcon />
				</button>
			)}
		</div>
	);
}
