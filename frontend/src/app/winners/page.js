"use client";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { abi, contractAddresses } from "../constants";
import { useState } from "react";

export default function page() {
	const { chain } = useNetwork();
	const { isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { data, isError } = useContractRead({
		address: competitionAddress,
		abi: abi,
		functionName: "showResult",
		watch: true,
	});

	return (
		<div className="flex items-center justify-center mt-44 mb-24">
			<div className="flex flex-col gap-5 items-center">
				{isError ? (
					<h4 className="text-lg font-bold">No Previous Winner</h4>
				) : (
					data != undefined && (
						<>
							<h4 className="text-lg font-bold">{`Previous Winner${
								data.length > 1 ? "s Were" : " Was"
							}`}</h4>
							{data.map((winner) => {
								return <h4 className="text-lg font-bold">{winner}!!!</h4>;
							})}
						</>
					)
				)}
			</div>
		</div>
	);
}
