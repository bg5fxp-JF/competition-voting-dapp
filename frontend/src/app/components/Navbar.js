import Link from "next/link";
import React from "react";

export default function Navbar() {
	return (
		<header className="w-full absolute z-10">
			<h1 className="py-4 text-center text-2xl font-bold sm:text-4xl">
				Competition Voting DApp
			</h1>
			<nav className="flex justify-center items-center max-w-[1440px] mx-auto gap-x-7 px-6 py-2 text-center text-xsm  bg-transparent sm:gap-x-24 sm:px-16 sm:text-reg">
				<Link className="transition-all hover:scale-125" href="/">
					Set Up Competition
				</Link>
				<Link className="transition-all hover:scale-125" href="/">
					Cast Vote
				</Link>
				<Link className="transition-all hover:scale-125" href="/">
					View Winners
				</Link>
			</nav>
		</header>
	);
}
