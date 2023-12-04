"use client";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";
import { useApprovedData } from "../context/ApprovedContext";

export default function Navbar() {
	const { isConnected } = useAccount();
	const { isApproved } = useApprovedData();

	return (
		<header className="w-full absolute z-10 top-0">
			<h1 className="py-4 text-center text-2xl font-bold sm:text-4xl">
				<Link href="/">Competition Voting DApp</Link>
			</h1>
			<nav className="flex justify-center items-center max-w-[1440px] mx-auto gap-x-7 px-6 py-2 text-center text-sm  bg-transparent sm:gap-x-24 sm:px-16 sm:text-reg">
				<Link
					className={`transition-all hover:scale-125 ${
						isConnected && isApproved
							? ""
							: " text-gray-400 pointer-events-none"
					}`}
					href="/set-competition"
				>
					Set Up Competition
				</Link>
				<Link
					className={`transition-all hover:scale-125 ${
						isConnected ? "" : " text-gray-400 pointer-events-none"
					}`}
					href="/vote"
				>
					Cast Vote
				</Link>
				<Link
					className={`transition-all hover:scale-125 ${
						isConnected ? "" : " text-gray-400 pointer-events-none"
					}`}
					href="/winners"
				>
					View Winners
				</Link>
			</nav>
		</header>
	);
}
