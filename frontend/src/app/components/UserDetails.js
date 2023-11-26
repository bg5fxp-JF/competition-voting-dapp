"use client";
import react, { useState } from "react";
import { useAccount, useDisconnect, useEnsName } from "wagmi";

import { FaUser, FaWindowClose } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function UserDetails() {
	const { address, isConnected } = useAccount();
	const { data: ensName } = useEnsName({ address });
	const { disconnect } = useDisconnect();

	const [isOpen, setIsOpen] = useState(false);

	function formatAddress(address) {
		return address.slice(0, 6) + "..." + address.slice(address.length - 4);
	}

	return (
		<AnimatePresence>
			{isConnected && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="absolute top-36 right-6 z-10  p-5 rounded text-sm bg-primaryColor shadow-md transition-transform sm:right-16 sm:text-reg"
				>
					<div>
						{isOpen ? (
							<div className="mt-7">
								<FaWindowClose
									className=" absolute top-4 right-5 cursor-pointer"
									onClick={() => {
										setIsOpen(!isOpen);
									}}
								/>

								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="flex flex-col  gap-y-3 "
								>
									<div className="flex items-center gap-x-3">
										Connected To:
										<div className="p-2 rounded bg-secondaryColor">
											{ensName ?? formatAddress(address)}
										</div>
									</div>
									<button
										onClick={() => {
											disconnect();
											setIsOpen(!isOpen);
										}}
										className="bg-secondaryColor p-2 rounded transition-all active:scale-125"
									>
										Disconnect Wallet
									</button>
								</motion.div>
							</div>
						) : (
							<AnimatePresence>
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
								>
									<FaUser
										className="cursor-pointer"
										onClick={() => {
											setIsOpen(!isOpen);
										}}
									/>
								</motion.div>
							</AnimatePresence>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
