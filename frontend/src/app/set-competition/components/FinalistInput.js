"use client";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

export default function FinalistInput() {
	const [finalists, setFinalists] = useState([""]);

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

	return (
		<div className="flex flex-col gap-4 transition-all">
			{finalists.map((finalist, index) => {
				return (
					<div key={index} className="flex gap-x-3">
						<div className="p-2 rounded shadow-md  w-full">
							<input
								placeholder="Enter an address"
								className=" focus-visible:outline-none "
								type="text"
								required
								value={finalist}
								onChange={(e) => handleFinalistChange(e, index)}
							/>
						</div>

						{finalists.length > 1 && (
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
			{finalists.length < 3 && (
				<button
					onClick={() => handleFinalistAdd()}
					className="flex p-2  justify-center rounded  bg-primaryColor dark:bg-primaryColor/70 shadow-md "
				>
					<PlusIcon />
				</button>
			)}
		</div>
	);
}
