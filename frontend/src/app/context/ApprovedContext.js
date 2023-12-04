"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { abi, contractAddresses } from "../constants";

const ApprovedContext = createContext({});

export default function ApprovedContextProvider({ children }) {
	const [isApproved, setIsApproved] = useState(false);

	const { chain } = useNetwork();

	const { address, isConnected } = useAccount();

	const chainId = isConnected ? chain.id : 0;
	const competitionAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const { data, isError, isLoading } = useContractRead({
		address: competitionAddress,
		abi: abi,
		functionName: "getIsApproved",
		args: [address],
		chainId: chainId,
	});

	useEffect(() => {
		setIsApproved(data);
	}, [data]);

	return (
		<ApprovedContext.Provider value={{ isApproved, setIsApproved }}>
			{children}
		</ApprovedContext.Provider>
	);
}

export function useApprovedData() {
	return useContext(ApprovedContext);
}
